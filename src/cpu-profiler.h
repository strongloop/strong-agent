// Copyright (c) 2015, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_CPU_PROFILER_H_
#define AGENT_SRC_CPU_PROFILER_H_

#include "strong-agent.h"
#include "base/atomicops.h"
#include "cpu-profiler-util.h"

#include <cxxabi.h>
#include <errno.h>
#include <dlfcn.h>
#include <pthread.h>
#include <semaphore.h>
#include <string.h>
#include <sys/mman.h>
#include <sys/syscall.h>
#include <unistd.h>

#if SL_OS_MACOS
#include <mach/mach.h>
#include <mach/semaphore.h>
#include <sys/sysctl.h>
#include <sys/types.h>
#include <ucontext.h>
#endif

#include <algorithm>
#include <functional>
#include <set>
#include <vector>

namespace strongloop {
namespace agent {
namespace cpuprofiler {

namespace BS = ::base::subtle;
namespace C = ::compat;

enum Tag { JIT_CODE_EVENT_TAG, PROFILE_SAMPLE_TAG, STOP_TAG };

class Semaphore {
 public:
  inline explicit Semaphore(unsigned value);
  inline ~Semaphore();
  inline void Post();  // Async signal-safe.
  inline void Wait();

 private:
#if SL_OS_LINUX
  sem_t semaphore_;
#elif SL_OS_MACOS
  semaphore_t semaphore_;
#endif
  DISALLOW_COPY_AND_ASSIGN(Semaphore);
};

// Single reader, single writer atomic ring buffer.
class RingBuffer {
 public:
  static const uint32_t kRingBufferSizeBits = 19;  // 512 kB
  static const uint32_t kRingBufferSize = 1 << kRingBufferSizeBits;
  static const uint32_t kAlignmentBits = 3;
  static const uint32_t kAlignment = 1 << kAlignmentBits;
  static const uint32_t kAlignmentMask = kAlignment - 1;

  // Verify that the ring buffer size vis-a-vis the alignment fits in 16 bits.
  SL_STATIC_ASSERT(kRingBufferSize / kAlignment <= 1 << 16);

  class Allocate;

  class Block {
   public:
    inline Tag tag() const;
    inline bool used() const;
    inline uint32_t size() const;
    template <typename T>
    inline T* To() const;

   private:
    friend class Allocate;
    enum Unused { UNUSED };
    class UsedField : public BitField64<bool, 0, 1> {};
    class TagField : public BitField64<Tag, 1, 4> {};
    class SizeField : public BitField64<uint32_t, 5, kRingBufferSizeBits> {};
    inline Block(Tag tag, uint32_t size);
    inline Block(Unused, uint32_t size);
    ~Block();  // Not destructible.
    const uint64_t bits_;
    DISALLOW_COPY_AND_ASSIGN(Block);
  };

  class Allocate {
   public:
    inline Allocate(RingBuffer* ring, Tag tag, uint32_t size = 0);
    inline ~Allocate();
    inline Block* block() const;

   private:
    Block* block_;
    RingBuffer* const ring_;
    const uint32_t saved_state_;
    DISALLOW_COPY_AND_ASSIGN(Allocate);
  };

  class Consume {
   public:
    inline explicit Consume(RingBuffer* ring);  // Blocks until there is data.
    inline ~Consume();
    inline Block* block() const;

   private:
    Block* block_;
    RingBuffer* const ring_;
    uint32_t saved_state_;
    DISALLOW_COPY_AND_ASSIGN(Consume);
  };

  RingBuffer() : semaphore_(0), state_(0) {}

 private:
  SL_STATIC_ASSERT(sizeof(Block) == RingBuffer::kAlignment);
  // TODO(bnoordhuis) Wrap encoded bytes in a type to avoid mixups with
  // decoded bytes?
  class ReadPos : public BitField32<uint16_t, 0, 16> {};
  class WritePos : public BitField32<uint16_t, 16, 16> {};
  inline static uint32_t DecodeBytes(uint32_t encoded_bytes);
  inline static uint32_t EncodeBytes(uint32_t bytes);
  Semaphore semaphore_;  // Used by signal handler to wake up event processor.
  BS::Atomic32 state_;
  char storage_[kRingBufferSize];
  DISALLOW_COPY_AND_ASSIGN(RingBuffer);
};

struct ProfileSample {
  uintptr_t call_stack[64];
};

// Used to store the address range and metadata for native code and
// JIT code objects.
class CodeEntry {
 public:
  // Must fit in a KindField.
  enum Kind { JAVASCRIPT, NATIVE };

  // For insertion.
  inline CodeEntry(Kind kind, uintptr_t code_start, uintptr_t code_end,
                   const char* name, size_t name_size);

  // For searching.
  inline explicit CodeEntry(uintptr_t address);

  inline uintptr_t code_start() const;
  inline uintptr_t code_end() const;
  inline uint32_t self_ticks() const;
  inline uint32_t total_ticks() const;
  const char* function_name() const;
  size_t function_name_size() const;
  const char* script_name() const;
  size_t script_name_size() const;
  uint32_t line_number() const;
  inline Kind kind() const;
  inline bool is_javascript() const;
  inline bool is_native() const;
  inline void set_code_end(uintptr_t value);
  inline bool operator<(const CodeEntry& that) const;

  inline void IncrementSelfTicks();
  inline void IncrementTotalTicks();
  inline void AddEdge(const CodeEntry* callee);

 private:
  friend class CpuProfileNode;

  typedef std::map<const CodeEntry*, uint32_t> Edges;

  class FunctionNameOffsetField : public BitField64<size_t, 0, 11> {};
  class FunctionNameSizeField : public BitField64<size_t, 11, 11> {};
  class ScriptNameSizeField : public BitField64<size_t, 22, 11> {};
  class ScriptNameOffsetField : public BitField64<size_t, 33, 11> {};
  class LineNumberField : public BitField64<uint32_t, 44, 16> {};
  class KindField : public BitField64<Kind, 62, 2> {};

  inline static uint64_t ComputeBits(Kind kind, const char* name, size_t size);

  const uintptr_t code_start_;
  uintptr_t code_end_;
  const uint64_t bits_;
  uint32_t self_ticks_;
  uint32_t total_ticks_;
  Edges child_nodes_;
  std::string name_;
  DISALLOW_COPY_AND_ASSIGN(CodeEntry);
};

class CpuProfiler {
 public:
  inline static CpuProfiler* ForCurrentThread();
  inline explicit CpuProfiler(v8::Isolate* isolate);
  inline ~CpuProfiler();
  inline void Start(int64_t timeout_in_ms, int64_t interval_in_ms);
  inline void Stop();
  inline void StartTimer();
  inline void StopTimer();
  inline uint32_t WatchdogActivationCount();

 private:
  friend class CpuProfile;

  struct CompareByPointer {
    bool operator()(const CodeEntry* a, const CodeEntry* b) const {
      return *a < *b;
    }
  };

  struct Edge {
    inline Edge(CodeEntry* caller, CodeEntry* callee);
    inline bool operator<(const Edge&) const;  // Orders by caller, then callee.
    CodeEntry* const caller;
    CodeEntry* const callee;
    mutable uint32_t ticks;
  };

  typedef std::vector<v8::JitCodeEvent*> JitCodeEventPointerVector;
  typedef std::set<CodeEntry*, CompareByPointer> CodeEntries;

  inline static void EventProcessorThreadMain(void* arg);
  inline static void OnExistingJitCodeEvent(const v8::JitCodeEvent* event);
  inline static void OnNewJitCodeEvent(const v8::JitCodeEvent* event);
  inline static void OnSignal(int nr, siginfo_t* si, void* ctx);

  inline CodeEntry* FindCodeEntry(uintptr_t address);
  inline CodeEntry* FindOrCreateCodeEntry(uintptr_t address);
  inline CodeEntry* CreateCodeEntry(CodeEntry::Kind kind,
                                    uintptr_t start_address,
                                    uintptr_t end_address,
                                    const char* const name,
                                    const size_t name_size);
  inline CodeEntry* CreateCodeEntry(uintptr_t start_address,
                                    uintptr_t end_address, const Dl_info* info);
  inline void ProcessJitCodeEvent(const v8::JitCodeEvent* event);
  inline void ProcessProfileSample(const ProfileSample* sample);

  v8::Isolate* const isolate_;
  volatile bool in_critical_section_;
  BS::Atomic32 dropped_jit_code_events_;
  BS::Atomic32 dropped_profiler_samples_;
  BS::Atomic32 signal_in_critical_section_;
  BS::Atomic32 unaccounted_ticks_;
  BS::Atomic32 watchdog_activation_flag_;
  uint32_t watchdog_activation_count_;
  CodeEntry root_entry_;
  CodeEntries code_entries_;
  JitCodeEventPointerVector jit_code_events_;
  uv_thread_t event_proc_thread_;
  itimerval profiler_interval_;
  RingBuffer ring_buffer_;
  static BS::Atomic32 signal_on_wrong_thread;

#if SL_OS_LINUX
#define SL_THREAD_LOCAL __thread CpuProfiler *
#elif SL_OS_MACOS
#define SL_THREAD_LOCAL CpuProfiler::ThreadLocal
  // No __thread on OS X but pthread_getspecific() is async-signal safe.
  struct ThreadLocal {
    ThreadLocal() { CHECK(0 == pthread_key_create(&key_, NULL)); }
    ~ThreadLocal() { CHECK(0 == pthread_key_delete(key_)); }
    void operator=(CpuProfiler* value) { pthread_setspecific(key_, value); }
    operator CpuProfiler*() {
      return static_cast<CpuProfiler*>(pthread_getspecific(key_));
    }
    pthread_key_t key_;
  };
#endif
  static SL_THREAD_LOCAL thread_local_instance;

  DISALLOW_COPY_AND_ASSIGN(CpuProfiler);
};

BS::Atomic32 CpuProfiler::signal_on_wrong_thread;
SL_THREAD_LOCAL CpuProfiler::thread_local_instance;

class StackFrameIterator {
 public:
  inline static void Initialize();  // Call at load time.
  inline StackFrameIterator(uintptr_t frame_pointer, uintptr_t stack_pointer);
  inline void Next();
  inline bool HasNext() const;
  inline uintptr_t frame_pointer() const;
  inline uintptr_t return_address() const;

 private:
  inline static uintptr_t FindStackTop();
  uintptr_t frame_pointer_;
  const uintptr_t stack_pointer_;
  // XXX(bnoordhuis) Make thread-local when multi-isolate support is added.
  static uintptr_t stack_top;
};

uintptr_t StackFrameIterator::stack_top;

#if SL_OS_LINUX
Semaphore::Semaphore(const unsigned value) {
  CHECK(0 == sem_init(&semaphore_, 0, value));
}

Semaphore::~Semaphore() { CHECK(0 == sem_destroy(&semaphore_)); }

void Semaphore::Post() { CHECK(0 == sem_post(&semaphore_)); }

void Semaphore::Wait() {
  while (sem_wait(&semaphore_)) {
    CHECK(errno == EINTR);
  }
}
#elif SL_OS_MACOS
Semaphore::Semaphore(const unsigned value) {
  CHECK(KERN_SUCCESS == semaphore_create(mach_task_self(), &semaphore_,
                                         SYNC_POLICY_FIFO, value));
}

Semaphore::~Semaphore() {
  CHECK(KERN_SUCCESS == semaphore_destroy(mach_task_self(), semaphore_));
}

void Semaphore::Post() { CHECK(KERN_SUCCESS == semaphore_signal(semaphore_)); }

void Semaphore::Wait() {
  int result;
  do {
    result = semaphore_wait(semaphore_);
  } while (result == KERN_ABORTED);
  CHECK(result == KERN_SUCCESS);
}
#endif  // SL_OS_MACOS

RingBuffer::Block::Block(Tag tag, uint32_t size)
    : bits_(UsedField::Update(TagField::Update(SizeField::Encode(size), tag),
                              true)) {
  CHECK(size == this->size());
}

RingBuffer::Block::Block(Unused, uint32_t size)
    : bits_(UsedField::Update(SizeField::Encode(size), false)) {}

Tag RingBuffer::Block::tag() const { return TagField::Decode(bits_); }
bool RingBuffer::Block::used() const { return UsedField::Decode(bits_); }
uint32_t RingBuffer::Block::size() const { return SizeField::Decode(bits_); }

template <typename T>
T* RingBuffer::Block::To() const {
  return reinterpret_cast<T*>(const_cast<Block*>(this) + 1);
}

RingBuffer::Allocate::Allocate(RingBuffer* const ring, const Tag tag,
                               const uint32_t size)
    : block_(NULL),
      ring_(ring),
      saved_state_(BS::NoBarrier_Load(&ring_->state_)) {
  const uint32_t rounded_size = RoundUp(size, kAlignment);
  const uint32_t real_size = sizeof(Block) + rounded_size;
  const uint32_t read_pos = DecodeBytes(ReadPos::Decode(saved_state_));
  const uint32_t write_pos = DecodeBytes(WritePos::Decode(saved_state_));
  // If we're at the end of the buffer and there is not enough space left,
  // wrap around to the start but check that there is enough space there.
  if (write_pos + real_size > ArraySize(ring_->storage_)) {
    if (real_size <= read_pos) {  // Only if enough space at start of buffer.
      // Create a block that tells the reader to skip to the next one.
      const uint32_t unused_space = ArraySize(ring_->storage_) - write_pos;
      new (ring_->storage_ + write_pos) Block(Block::UNUSED, unused_space);
      // Create the block we're going to operate on.
      block_ = new (ring_->storage_ + 0) Block(tag, rounded_size);
      CHECK(rounded_size == block_->size());
    }
  } else {
    // Check that the allocation doesn't overlap with the position of
    // the reader.  If read_pos == write_pos, the reader has caught up
    // with the writer, but if read_pos > write_pos, then the writer may
    // have gone full circle and be about to catch up with the reader.
    if (write_pos >= read_pos || write_pos + real_size <= read_pos) {
      block_ = new (ring_->storage_ + write_pos) Block(tag, rounded_size);
      CHECK(rounded_size == block_->size());
    }
  }
}

RingBuffer::Allocate::~Allocate() {
  if (block_ == NULL) return;
  const uint32_t new_write_pos =
      block_->To<char>() - ring_->storage_ + block_->size();
  uint32_t expected_state = saved_state_;
  for (;;) {
    const uint32_t new_state =
        WritePos::Update(expected_state, EncodeBytes(new_write_pos));
    const uint32_t old_state =
        BS::NoBarrier_CompareAndSwap(&ring_->state_, expected_state, new_state);
    if (old_state == expected_state) break;
    // Verify that the old write_pos is unchanged.
    CHECK(WritePos::Decode(saved_state_) == WritePos::Decode(old_state));
    expected_state = old_state;  // Dirtied by reader.
  }
  ring_->semaphore_.Post();  // Async signal-safe.
}

RingBuffer::Block* RingBuffer::Allocate::block() const { return block_; }

RingBuffer::Consume::Consume(RingBuffer* const ring) : ring_(ring) {
  ring_->semaphore_.Wait();
  saved_state_ = BS::NoBarrier_Load(&ring_->state_);
  const uint32_t read_pos = DecodeBytes(ReadPos::Decode(saved_state_));
  const uint32_t write_pos = DecodeBytes(WritePos::Decode(saved_state_));
  CHECK(read_pos != write_pos);
  block_ = reinterpret_cast<Block*>(ring_->storage_ + read_pos);
  if (block_->used()) return;
  // Skip over empty chunk at end of buffer.
  block_ = reinterpret_cast<Block*>(ring_->storage_);
}

RingBuffer::Consume::~Consume() {
  const uint32_t new_read_pos =
      block_->To<char>() - ring_->storage_ + block_->size();
  uint32_t expected_state = saved_state_;
  for (;;) {
    const uint32_t new_state =
        ReadPos::Update(expected_state, EncodeBytes(new_read_pos));
    const uint32_t old_state =
        BS::NoBarrier_CompareAndSwap(&ring_->state_, expected_state, new_state);
    if (old_state == expected_state) break;
    // Verify that the old read_pos is unchanged.
    CHECK(ReadPos::Decode(saved_state_) == ReadPos::Decode(old_state));
    expected_state = old_state;  // Dirtied by writer.
  }
}

RingBuffer::Block* RingBuffer::Consume::block() const { return block_; }

uint32_t RingBuffer::DecodeBytes(uint32_t encoded_bytes) {
  return encoded_bytes << kAlignmentBits;
}

uint32_t RingBuffer::EncodeBytes(uint32_t bytes) {
  CHECK(0 == (bytes & kAlignmentMask));
  return bytes >> kAlignmentBits;
}

inline size_t JitCodeEventSize(const v8::JitCodeEvent* const event) {
  size_t size = sizeof(*event);
  if (event->type == v8::JitCodeEvent::CODE_ADDED) {
    size += event->name.len;
  }
  return size;
}

// |copy| should have enough room following it to store the name in case of
// a CODE_ADDED event, i.e. `(char*) &copy[1]` should have enough room to
// store `event->name.len` characters.
inline void CopyJitCodeEvent(const v8::JitCodeEvent* const event,
                             v8::JitCodeEvent* const copy) {
  *copy = *event;
  if (event->type == v8::JitCodeEvent::CODE_ADDED) {
    char* const name_str = reinterpret_cast<char*>(copy + 1);
    Copy(name_str, event->name.str, event->name.len);
    copy->name.str = name_str;
  }
}

uint64_t CodeEntry::ComputeBits(const Kind kind, const char* const name,
                                const size_t size) {
  uint64_t bits = KindField::Encode(kind);
  size_t function_name_offset;
  size_t function_name_size;
  size_t script_name_offset;
  size_t script_name_size;
  uint32_t line_number;
  if (kind == JAVASCRIPT &&
      ParseJSFunctionName(name, size, &function_name_offset,
                          &function_name_size, &script_name_offset,
                          &script_name_size, &line_number)) {
    bits = FunctionNameOffsetField::Update(bits, function_name_offset);
    bits = FunctionNameSizeField::Update(bits, function_name_size);
    bits = ScriptNameOffsetField::Update(bits, script_name_offset);
    bits = ScriptNameSizeField::Update(bits, script_name_size);
    bits = LineNumberField::Update(bits, line_number);
  } else {
    // Assume it's just a C or JS function name, or a special entry
    // like "Builtin:A builtin from the snapshot".
    bits = FunctionNameSizeField::Update(bits, size);
  }
  return bits;
}

CodeEntry::CodeEntry(uintptr_t address)
    : code_start_(address),
      code_end_(address),
      bits_(0),
      self_ticks_(0),
      total_ticks_(0) {}

CodeEntry::CodeEntry(Kind kind, uintptr_t code_start, uintptr_t code_end,
                     const char* name, size_t name_size)
    : code_start_(code_start),
      code_end_(code_end),
      bits_(ComputeBits(kind, name, name_size)),
      self_ticks_(0),
      total_ticks_(0),
      name_(name, name_size) {}

uintptr_t CodeEntry::code_start() const { return code_start_; }
uintptr_t CodeEntry::code_end() const { return code_end_; }
uint32_t CodeEntry::self_ticks() const { return self_ticks_; }
uint32_t CodeEntry::total_ticks() const { return total_ticks_; }

void CodeEntry::IncrementSelfTicks() { self_ticks_ += 1; }
void CodeEntry::IncrementTotalTicks() { total_ticks_ += 1; }
void CodeEntry::set_code_end(uintptr_t value) { code_end_ = value; }

const char* CodeEntry::function_name() const {
  if (function_name_size() == 0) {
    return "(anonymous function)";
  }
  return name_.data() + FunctionNameOffsetField::Decode(bits_);
}

size_t CodeEntry::function_name_size() const {
  return FunctionNameSizeField::Decode(bits_);
}

const char* CodeEntry::script_name() const {
  return name_.data() + ScriptNameOffsetField::Decode(bits_);
}

size_t CodeEntry::script_name_size() const {
  return ScriptNameSizeField::Decode(bits_);
}

uint32_t CodeEntry::line_number() const {
  return LineNumberField::Decode(bits_);
}

CodeEntry::Kind CodeEntry::kind() const { return KindField::Decode(bits_); }
bool CodeEntry::is_javascript() const { return kind() == JAVASCRIPT; }
bool CodeEntry::is_native() const { return kind() == NATIVE; }

bool CodeEntry::operator<(const CodeEntry& that) const {
  return code_end() < that.code_start();
}

CpuProfiler::Edge::Edge(CodeEntry* const caller, CodeEntry* const callee)
    : caller(caller), callee(callee), ticks(0) {}

bool CpuProfiler::Edge::operator<(const Edge& that) const {
  return caller != that.caller ? caller < that.caller : callee < that.callee;
}

CpuProfiler* CpuProfiler::ForCurrentThread() { return thread_local_instance; }

CpuProfiler::CpuProfiler(v8::Isolate* isolate)
    : isolate_(isolate),
      in_critical_section_(false),
      dropped_jit_code_events_(0),
      dropped_profiler_samples_(0),
      signal_in_critical_section_(0),
      unaccounted_ticks_(0),
      watchdog_activation_flag_(0),
      watchdog_activation_count_(0),
      root_entry_(CodeEntry::JAVASCRIPT, 0, 0, "(root)", 6) {}

CpuProfiler::~CpuProfiler() {
  if (this == ForCurrentThread()) Stop();
  std::for_each(code_entries_.begin(), code_entries_.end(),
                std::ptr_fun(operator delete));
  code_entries_.clear();
}

void CpuProfiler::Start(int64_t timeout_in_ms, int64_t interval_in_ms) {
  CHECK(ForCurrentThread() == NULL);
  // Needs to be set early, methods like OnExistingJitCodeEvent depend on it.
  thread_local_instance = this;
  profiler_interval_.it_value.tv_sec = timeout_in_ms / 1000;
  profiler_interval_.it_value.tv_usec = (timeout_in_ms % 1000) * 1000;
  profiler_interval_.it_interval.tv_sec = interval_in_ms / 1000;
  profiler_interval_.it_interval.tv_usec = (interval_in_ms % 1000) * 1000;
  // Disable code compaction so we don't have to track code relocations.
  // FIXME(bnoordhuis) We'll need to handle relocations when/if an 'always on'
  // mode is implemented.  They're very infrequent, though, and I'm not sure
  // if V8 even implements CODE_MOVED.  We may get away with punting on this
  // indefinitely.
  {
    static const char flag[] = "--nocompact_code_space";
    v8::V8::SetFlagsFromString(flag, sizeof(flag) - 1);
  }
  // Collect existing code objects first and send them wholesale to the
  // event processor thread.  v8::kJitCodeEventEnumExisting generates a
  // ton of synchronous CODE_ADDED events, possibly so many that it
  // overflows the ring buffer.
  C::Isolate::SetJitCodeEventHandler(isolate_, v8::kJitCodeEventEnumExisting,
                                     OnExistingJitCodeEvent);
  C::Isolate::SetJitCodeEventHandler(isolate_, v8::kJitCodeEventDefault,
                                     OnNewJitCodeEvent);
  // Create the event processor thread with all signals blocked, otherwise
  // signals frequently get delivered to the wrong thread on OS X.
  // The libuv and V8 thread pools don't block SIGPROF so some signals will
  // still end up on the wrong thread but that's outside our control.
  {
    sigset_t block_all_signals;
    sigset_t saved_set;
    sigfillset(&block_all_signals);
    CHECK(0 == pthread_sigmask(SIG_SETMASK, &block_all_signals, &saved_set));
    CHECK(0 == uv_thread_create(&event_proc_thread_, EventProcessorThreadMain,
                                this));
    CHECK(0 == pthread_sigmask(SIG_SETMASK, &saved_set, NULL));
  }
  {
    struct sigaction act;
    memset(&act, 0, sizeof(act));
    act.sa_sigaction = OnSignal;
    act.sa_flags = SA_RESTART | SA_SIGINFO;
    CHECK(0 == sigaction(SIGPROF, &act, NULL));
  }
  {
    sigset_t set;
    sigemptyset(&set);
    sigaddset(&set, SIGPROF);
    CHECK(0 == pthread_sigmask(SIG_UNBLOCK, &set, NULL));
  }
  StartTimer();
}

void CpuProfiler::Stop() {
  StopTimer();
  // XXX(bnoordhuis) Ignore SIGPROF signals, don't restore the original
  // signal disposition.  Restoring is dangerous under valgrind because
  // it has a habit of delivering pending signals late.  You can't soak
  // them up with sigpending() + sigwait() because sigpending() reports
  // no pending signals but valgrind delivers them anyway, killing the
  // process when the signal isn't ignored or handled.
  {
    struct sigaction act;
    memset(&act, 0, sizeof(act));
    act.sa_handler = SIG_IGN;
    CHECK(0 == sigaction(SIGPROF, &act, NULL));
  }
  C::Isolate::SetJitCodeEventHandler(isolate_, v8::kJitCodeEventDefault, NULL);
  {
    in_critical_section_ = true;
    { RingBuffer::Allocate storage(&ring_buffer_, STOP_TAG); }
    in_critical_section_ = false;
  }
  CHECK(0 == uv_thread_join(&event_proc_thread_));
  CHECK(ForCurrentThread() == this);
  thread_local_instance = NULL;
  {
    static const char flag[] = "--compact_code_space";
    v8::V8::SetFlagsFromString(flag, sizeof(flag) - 1);
  }
}

void CpuProfiler::StartTimer() {
  CHECK(0 == setitimer(ITIMER_PROF, &profiler_interval_, NULL));
}

void CpuProfiler::StopTimer() {
  static const itimerval stop_timer = {{0, 0}, {0, 0}};
  CHECK(0 == setitimer(ITIMER_PROF, &stop_timer, NULL));
  if (BS::NoBarrier_AtomicExchange(&watchdog_activation_flag_, 0)) {
    watchdog_activation_count_ += 1;
  }
}

uint32_t CpuProfiler::WatchdogActivationCount() {
  const uint32_t value = watchdog_activation_count_;
  watchdog_activation_count_ = 0;
  return value;
}

void CpuProfiler::EventProcessorThreadMain(void* arg) {
  CpuProfiler* const self = static_cast<CpuProfiler*>(arg);

  // Give the thread a recognizable name.  Errors ignored intentionally.
  {
    static const char friendly_thread_name[] = "SLEventProcessor";
#if SL_OS_MACOS
    pthread_setname_np(friendly_thread_name);
#elif SL_OS_LINUX
    syscall(SYS_prctl, 15 /* PR_SET_NAME */, friendly_thread_name);
#endif  // SL_OS_LINUX
  }

  for (JitCodeEventPointerVector::iterator it = self->jit_code_events_.begin(),
                                           end = self->jit_code_events_.end();
       it != end; ++it) {
    self->ProcessJitCodeEvent(*it);
    delete[] reinterpret_cast<char*>(*it);
  }
  self->jit_code_events_.clear();

  // TODO(bnoordhuis) We probably need to process JitCodeEvent entries first
  // or we might end up with tick samples for which the JitCodeEvent is still
  // outstanding.
  for (;;) {
    RingBuffer::Consume storage(&self->ring_buffer_);
    RingBuffer::Block* const block = storage.block();

    if (block->tag() == JIT_CODE_EVENT_TAG) {
      v8::JitCodeEvent* const event = block->To<v8::JitCodeEvent>();
      self->ProcessJitCodeEvent(event);
      continue;
    }

    if (block->tag() == PROFILE_SAMPLE_TAG) {
      ProfileSample* const sample = block->To<ProfileSample>();
      self->ProcessProfileSample(sample);
      continue;
    }

    if (block->tag() == STOP_TAG) {
      break;
    }
  }
}

void CpuProfiler::OnExistingJitCodeEvent(const v8::JitCodeEvent* const event) {
  CpuProfiler* const self = ForCurrentThread();
  // XXX(bnoordhuis) Filter out stubs and ICs?  They aren't interesting
  // but they make up the bulk of CODE_ADDED events.  One problem is that
  // we may end up with profiler samples that don't match anything.
  switch (event->type) {
    case v8::JitCodeEvent::CODE_ADDED: {
      const size_t size = JitCodeEventSize(event);
      char* const raw_copy = new char[size];
      v8::JitCodeEvent* copy = reinterpret_cast<v8::JitCodeEvent*>(raw_copy);
      CopyJitCodeEvent(event, copy);
      self->jit_code_events_.push_back(copy);
    } break;
    case v8::JitCodeEvent::CODE_MOVED:
    case v8::JitCodeEvent::CODE_REMOVED:
      // Should not happen because we run with --nocompact_code_space.
      fprintf(stderr, "Unexpected jit code event %d for code range %p:%p\n",
              event->type, event->code_start,
              static_cast<char*>(event->code_start) + event->code_len);
      break;
#if NODE_VERSION_AT_LEAST(0, 11, 0)
    case v8::JitCodeEvent::CODE_ADD_LINE_POS_INFO:
    case v8::JitCodeEvent::CODE_START_LINE_INFO_RECORDING:
    case v8::JitCodeEvent::CODE_END_LINE_INFO_RECORDING:
      // TODO(bnoordhuis) Use line and position info to map profiler samples
      // to line and column numbers.
      break;
#endif
  }
}

void CpuProfiler::OnNewJitCodeEvent(const v8::JitCodeEvent* const event) {
  CpuProfiler* const self = ForCurrentThread();
  // XXX(bnoordhuis) Filter out stubs and ICs?  They aren't interesting
  // but they make up the bulk of CODE_ADDED events.  The downside is
  // that we can end up with profiler samples that don't match anything.
  switch (event->type) {
    case v8::JitCodeEvent::CODE_ADDED:
      // Avoid races with the SIGPROF handler.  We may lose some samples
      // this way but that's okay, we'd only be measuring ourselves.
      self->in_critical_section_ = true;
      {
        const Tag tag = JIT_CODE_EVENT_TAG;
        const size_t size = JitCodeEventSize(event);
        RingBuffer::Allocate storage(&self->ring_buffer_, tag, size);
        RingBuffer::Block* const block = storage.block();
        if (block == NULL) {  // Ring buffer is full.
          BS::NoBarrier_AtomicIncrement(&self->dropped_jit_code_events_, 1);
        } else {
          CopyJitCodeEvent(event, block->To<v8::JitCodeEvent>());
        }
      }
      self->in_critical_section_ = false;
      break;
    case v8::JitCodeEvent::CODE_MOVED:
    case v8::JitCodeEvent::CODE_REMOVED:
      // Should not happen because we run with --nocompact_code_space.
      fprintf(stderr, "Unexpected jit code event %d for code range %p:%p\n",
              event->type, event->code_start,
              static_cast<char*>(event->code_start) + event->code_len);
      break;
#if NODE_VERSION_AT_LEAST(0, 11, 0)
    case v8::JitCodeEvent::CODE_ADD_LINE_POS_INFO:
    case v8::JitCodeEvent::CODE_START_LINE_INFO_RECORDING:
    case v8::JitCodeEvent::CODE_END_LINE_INFO_RECORDING:
      // TODO(bnoordhuis) Use line and position info to map profiler samples
      // to line and column numbers.
      break;
#endif
  }
}

void CpuProfiler::OnSignal(int, siginfo_t*, void* const ctx) {
  CpuProfiler* const self = ForCurrentThread();
  // Ignore signal delivered on other threads.
  if (self == NULL) {
    BS::NoBarrier_AtomicIncrement(&signal_on_wrong_thread, 1);
    return;
  }
  BS::NoBarrier_Store(&self->watchdog_activation_flag_, 1);
  // Avoid racing with allocations in the main thread.
  if (self->in_critical_section_ == true) {
    BS::NoBarrier_AtomicIncrement(&self->signal_in_critical_section_, 1);
    return;
  }
  const Tag tag = PROFILE_SAMPLE_TAG;
  RingBuffer::Allocate storage(&self->ring_buffer_, tag, sizeof(ProfileSample));
  RingBuffer::Block* const block = storage.block();
  if (block == NULL) {
    BS::NoBarrier_AtomicIncrement(&self->dropped_profiler_samples_, 1);
    return;  // Ring buffer is full.
  }
  ProfileSample* const sample = block->To<ProfileSample>();
  ucontext_t* const uctx = static_cast<ucontext_t*>(ctx);
#if SL_OS_MACOS
  _STRUCT_MCONTEXT* const mctx = uctx->uc_mcontext;
#if SL_CPU_X86
  const uintptr_t bp = mctx->ss.ebp;
  const uintptr_t ip = mctx->ss.eip;
  const uintptr_t sp = mctx->ss.esp;
#elif SL_CPU_X86_64
  const uintptr_t bp = mctx->__ss.__rbp;
  const uintptr_t ip = mctx->__ss.__rip;
  const uintptr_t sp = mctx->__ss.__rsp;
#endif  // SL_CPU_X86_64
#elif SL_OS_LINUX
  mcontext_t* const mctx = &uctx->uc_mcontext;
#if SL_CPU_X86
  const uintptr_t bp = mctx->gregs[REG_EBP];
  const uintptr_t ip = mctx->gregs[REG_EIP];
  const uintptr_t sp = mctx->gregs[REG_ESP];
#elif SL_CPU_X86_64
  const uintptr_t bp = mctx->gregs[REG_RBP];
  const uintptr_t ip = mctx->gregs[REG_RIP];
  const uintptr_t sp = mctx->gregs[REG_RSP];
#endif  // SL_CPU_X86_64
#endif  // SL_OS_LINUX
  sample->call_stack[0] = ip;
  const size_t count = ArraySize(sample->call_stack);
  size_t n = 1;
  for (StackFrameIterator it(bp, sp); n < count && it.HasNext();
       n += 1, it.Next()) {
    sample->call_stack[n] = it.return_address();
  }
  while (n < count) {
    sample->call_stack[n] = 0;
    n += 1;
  }
}

void CpuProfiler::ProcessJitCodeEvent(const v8::JitCodeEvent* const event) {
  // We should only see CODE_ADDED events here by virtue of setting
  // --nocompact_code_space in CpuProfiler::Start().
  CHECK(event->type == v8::JitCodeEvent::CODE_ADDED);
  const uintptr_t code_start = reinterpret_cast<uintptr_t>(event->code_start);
  const uintptr_t code_end = code_start + event->code_len;
  CodeEntry* const entry =
      new CodeEntry(CodeEntry::JAVASCRIPT, code_start, code_end,
                    event->name.str, event->name.len);
  std::pair<CodeEntries::iterator, bool> pair = code_entries_.insert(entry);
  const bool is_new_code_object = pair.second;
  if (is_new_code_object == false) {
    // V8 often reports multiple CODE_ADDED events for the same code object.
    delete entry;
  }
}

void CpuProfiler::ProcessProfileSample(const ProfileSample* const sample) {
  const size_t count = ArraySize(sample->call_stack);
  size_t n = count - 1;
  // The last in-use slot is the bottom-most address of the call stack.
  while (sample->call_stack[n] == 0 && n > 0) {
    n -= 1;
  }
  CodeEntry* caller = &root_entry_;
  do {
    caller->IncrementTotalTicks();
    CodeEntry* const callee = FindOrCreateCodeEntry(sample->call_stack[n]);
    caller->AddEdge(callee);
    caller = callee;
  } while (n-- > 0);
  caller->IncrementSelfTicks();
}

CodeEntry* CpuProfiler::FindCodeEntry(const uintptr_t address) {
  CodeEntry entry(address);
  CodeEntries::iterator it = code_entries_.find(&entry);
  return it != code_entries_.end() ? *it : NULL;
}

CodeEntry* CpuProfiler::FindOrCreateCodeEntry(const uintptr_t address) {
  if (CodeEntry* entry = FindCodeEntry(address)) return entry;
  // The address isn't for JIT'ed code because we know start and end addresses
  // of all JIT code objects, but maybe it can be resolved to native code.
  Dl_info info;
  if (!dladdr(reinterpret_cast<void*>(address), &info)) {
    // Address doesn't map to a symbol.  Create a CodeEntry that covers just
    // the address itself.
    BS::NoBarrier_AtomicIncrement(&unaccounted_ticks_, 1);
    static const char label[] = "(unknown)";
    return CreateCodeEntry(CodeEntry::NATIVE, address, address + 1, label,
                           sizeof(label) - 1);
  }
  // Find the code object by the symbol's base address.  Create a new entry
  // if necessary.  If dladdr() doesn't find an exact match, use the shared
  // object's name instead and insert a code object for just the PC address.
  const uintptr_t start_address =
      info.dli_saddr ? reinterpret_cast<uintptr_t>(info.dli_saddr) : address;
  const uintptr_t end_address = address + 1;
  CodeEntry* entry = FindCodeEntry(start_address);
  if (entry == NULL) {
    entry = CreateCodeEntry(start_address, end_address, &info);
  } else if (entry->code_end() < end_address) {
    entry->set_code_end(end_address);
  }
  return entry;
}

CodeEntry* CpuProfiler::CreateCodeEntry(const CodeEntry::Kind kind,
                                        const uintptr_t start_address,
                                        const uintptr_t end_address,
                                        const char* const name,
                                        const size_t name_size) {
  CodeEntry* const entry =
      new CodeEntry(kind, start_address, end_address, name, name_size);
  std::pair<CodeEntries::iterator, bool> pair = code_entries_.insert(entry);
  if (pair.second == false) {
    // V8 often reports multiple CODE_ADDED events for the same code object.
    CHECK(entry->code_start() == start_address);
    CHECK(entry->code_end() == end_address);
    delete entry;
  }
  return *pair.first;
}

void CodeEntry::AddEdge(const CodeEntry* const callee) {
  child_nodes_[callee] += 1;
}

CodeEntry* CpuProfiler::CreateCodeEntry(const uintptr_t start_address,
                                        const uintptr_t end_address,
                                        const Dl_info* const info) {
  char* demangled_name = NULL;
  const char* name = info->dli_sname;
  // Only call __cxa_demangle() if the symbol is a C++ symbol.  It won't
  // demangle C symbols (nothing to demangle) but it still allocates memory.
  if (name != NULL && name[0] == '_' && name[1] == 'Z') {
    int status;
    demangled_name = __cxxabiv1::__cxa_demangle(name, NULL, NULL, &status);
  }
  const char* display_name = demangled_name;
  if (display_name == NULL) {
    // Use the shared object's name if dladdr() didn't find an exact match.
    // TODO(bnoordhuis) Look up symbol in DWARF section of the shared object.
    display_name = (name != NULL) ? name : info->dli_fname;
  }
  CodeEntry* const entry =
      CreateCodeEntry(CodeEntry::NATIVE, start_address, end_address,
                      display_name, strlen(display_name));
  if (demangled_name != NULL) {
    free(demangled_name);
  }
  return entry;
}

const CpuProfileNode* CpuProfile::GetTopDownRoot() const {
  const CpuProfiler* const that = reinterpret_cast<const CpuProfiler*>(this);
  return reinterpret_cast<const CpuProfileNode*>(&that->root_entry_);
}

// TODO(bnoordhuis) Implement.  Maybe implement GetSampleTimestamp() as well.
uint32_t CpuProfile::GetSamplesCount() const { return 0; }

// TODO(bnoordhuis) Implement.  Maybe implement GetSampleTimestamp() as well.
const CpuProfileNode* CpuProfile::GetSample(uint32_t) const { return NULL; }

void CpuProfile::Delete() {
  CpuProfiler* const that = reinterpret_cast<CpuProfiler*>(this);
  CHECK(that != CpuProfiler::ForCurrentThread());
  delete that;
}

uint32_t CpuProfileNode::GetChildrenCount() const {
  return reinterpret_cast<const CodeEntry*>(this)->child_nodes_.size();
}

const CpuProfileNode* CpuProfileNode::GetChild(const uint32_t index) const {
  const CodeEntry* const that = reinterpret_cast<const CodeEntry*>(this);
  // FIXME(bnoordhuis) O(n^2) although |n| will usually be small.
  uint32_t n = 0;
  for (CodeEntry::Edges::const_iterator it = that->child_nodes_.begin(),
                                        end = that->child_nodes_.end();
       it != end; ++it, ++n) {
    if (n == index) return reinterpret_cast<const CpuProfileNode*>(it->first);
  }
  return NULL;
}

uint32_t CpuProfileNode::GetCallUid() const { return 0; }

uint32_t CpuProfileNode::GetHitCount() const {
  return reinterpret_cast<const CodeEntry*>(this)->self_ticks();
}

uint32_t CpuProfileNode::GetLineNumber() const {
  return reinterpret_cast<const CodeEntry*>(this)->line_number();
}

uint32_t CpuProfileNode::GetNodeId() const { return 0; }

size_t CpuProfileNode::GetFunctionName(char* const buffer,
                                       const size_t size) const {
  const CodeEntry* const that = reinterpret_cast<const CodeEntry*>(this);
  return CopyZ(that->function_name(), that->function_name_size(), buffer, size);
}

size_t CpuProfileNode::GetScriptResourceName(char* const buffer,
                                             const size_t size) const {
  const CodeEntry* const that = reinterpret_cast<const CodeEntry*>(this);
  return CopyZ(that->script_name(), that->script_name_size(), buffer, size);
}

void StackFrameIterator::Initialize() { stack_top = FindStackTop(); }

StackFrameIterator::StackFrameIterator(uintptr_t frame_pointer,
                                       uintptr_t stack_pointer)
    : frame_pointer_(frame_pointer), stack_pointer_(stack_pointer) {}

bool StackFrameIterator::HasNext() const {
  return frame_pointer_ >= stack_pointer_ && frame_pointer_ < stack_top;
}

void StackFrameIterator::Next() { frame_pointer_ = frame_pointer(); }

uintptr_t StackFrameIterator::frame_pointer() const {
  return reinterpret_cast<uintptr_t*>(frame_pointer_)[0];
}

uintptr_t StackFrameIterator::return_address() const {
  return reinterpret_cast<uintptr_t*>(frame_pointer_)[1];
}

uintptr_t StackFrameIterator::FindStackTop() {
#if SL_OS_MACOS
  {
    uintptr_t stack_top = 0;
    size_t size = sizeof(stack_top);
    int mib[2] = {CTL_KERN, KERN_USRSTACK};

    if (sysctl(mib, ArraySize(mib), &stack_top, &size, NULL, 0) == 0)
      return stack_top;
  }
#elif SL_OS_LINUX
  {
    uintptr_t* const libc_stack_end =
        reinterpret_cast<uintptr_t*>(dlsym(RTLD_DEFAULT, "__libc_stack_end"));

    if (libc_stack_end != NULL) return *libc_stack_end;
  }
#endif  // SL_OS_LINUX

  // Try to find out where the bottom of the stack is.  Follow frame pointers
  // until there is either a big discontinuity or the frame pointer is a guard
  // frame that points back to itself.  This won't always find the absolute
  // bottom of the stack but it should be close enough to make no difference.
  uintptr_t frame_pointer =
      reinterpret_cast<uintptr_t>(__builtin_frame_address(0));

  while (frame_pointer != 0) {
    const uintptr_t next_frame = reinterpret_cast<uintptr_t*>(frame_pointer)[0];
    const uintptr_t distance = next_frame - frame_pointer;

    if (distance == 0) break;

    // Stacks can be bigger than 2 MB but individual stack frames are normally
    // much smaller.
    if (distance > 2 << 20) break;

    frame_pointer = next_frame;
  }

  return frame_pointer;
}

#if SL_OS_MACOS
inline int SystemCall(int kq, const kevent64_s* changelist, int nchanges,
                      kevent64_s* eventlist, int nevents,
                      const timespec* poll_timeout) {
  CpuProfiler* const profiler = CpuProfiler::ForCurrentThread();
  if (profiler != NULL) {
    profiler->StopTimer();
  }
  const int err = syscall(SYS_kevent, kq, changelist, nchanges, eventlist,
                          nevents, poll_timeout);
  if (profiler != NULL) {
    profiler->StartTimer();
  }
  return err;
}
#elif SL_OS_LINUX
inline long SystemCall(long nr, long a, long b,           // NOLINT(runtime/int)
                       long c, long d, long e, long f) {  // NOLINT(runtime/int)
  const bool is_epoll = (nr == SYS_epoll_wait || nr == SYS_epoll_pwait);
  CpuProfiler* const profiler =
      is_epoll ? CpuProfiler::ForCurrentThread() : NULL;
  if (profiler != NULL) {
    profiler->StopTimer();
  }
  long result;  // NOLINT(runtime/int)
#if SL_CPU_X86
  __asm__ __volatile__(
      "push %%ebp;"
      "mov %7, %%ebp;"
      "int $0x80;"
      "pop %%ebp;"
      : "=a"(result)
      : "a"(nr), "b"(a), "c"(b), "d"(c), "S"(d), "D"(e), "g"(f)
      : "memory");
#elif SL_CPU_X86_64
  __asm__ __volatile__(
      "mov %5, %%r10;"
      "mov %6, %%r8;"
      "mov %7, %%r9;"
      "syscall;"
      : "=a"(result)
      : "a"(nr), "D"(a), "S"(b), "d"(c), "g"(d), "g"(e), "g"(f)
      : "rcx", "r11", "r10", "r8", "r9", "memory");
#endif  // SL_CPU_X86_64
  if (profiler != NULL) {
    profiler->StartTimer();
  }
  if (result > -4096 && result < 0) {
    errno = -result;
    return -1;
  }
  return result;
}
#endif  // SL_OS_LINUX

inline void HookSystemCall() {
#if SL_OS_MACOS
  uint8_t* const address = reinterpret_cast<uint8_t*>(&kevent);
#elif SL_OS_LINUX
  uint8_t* const address = reinterpret_cast<uint8_t*>(&syscall);
#endif  // SL_OS_LINUX
  const size_t page_size = getpagesize();
  uint8_t* const page_address = reinterpret_cast<uint8_t*>(
      reinterpret_cast<uintptr_t>(address) & ~(page_size - 1));
  sigset_t saved_set;
  // Temporarily block signals so we won't deadlock with
  // a signal handler while patching the syscall() wrapper.
  {
    sigset_t set;
    sigfillset(&set);
    CHECK(0 == pthread_sigmask(SIG_SETMASK, &set, &saved_set));
  }
  // Temporarily lift the W^X protection.
  {
    const int protection = PROT_READ | PROT_WRITE | PROT_EXEC;
    CHECK(0 == mprotect(page_address, page_size, protection));
  }
// Poke in JMP instructions that jump back to the start of the function.
// Suspends syscall() calls from other threads while we're patching the code.
#if SL_CPU_X86
  *reinterpret_cast<volatile uint32_t*>(address + 0) = 0xFCEBFEEB;
  *reinterpret_cast<volatile uint32_t*>(address + 4) = 0xF8EBFAEB;
#elif SL_CPU_X86_64
  *reinterpret_cast<volatile uint64_t*>(address + 0) = 0xF8EBFAEBFCEBFEEBULL;
  *reinterpret_cast<volatile uint32_t*>(address + 8) = 0xF4EBF6EB;
#endif  // SL_CPU_X86_64
  // Grace period to avoid racing with syscall() calls from other threads.
  {
    struct timespec t = {0, 1000};
    nanosleep(&t, NULL);
  }
#if SL_CPU_X86
  // Poke in a "jmp <target>" diversion that calls our hook.  Note that the
  // jump address is relative to EIP + 5.  Update the first word last so
  // that other threads remain captured.
  {
    uint32_t target = reinterpret_cast<uint32_t>(&SystemCall);
    target -= reinterpret_cast<uint32_t>(address);
    target -= 5;
    // Poke in the high 8 bits of the function address, followed by some nops.
    *reinterpret_cast<volatile uint32_t*>(address + 4) = (target >> 24);
    // Now poke in the JMP instruction and the low 24 bits.
    *reinterpret_cast<volatile uint32_t*>(address + 0) = (target << 8) | 0xE9;
  }
#elif SL_CPU_X86_64
  // Poke in a "movabs <target>, %rax; jmp *%rax" diversion that calls our
  // hook.  Update the first word last so that other threads remain captured
  // until both instructions have been poked in.
  *reinterpret_cast<volatile uint64_t*>(address + 2) =
      reinterpret_cast<uint64_t>(&SystemCall);
  *reinterpret_cast<volatile uint16_t*>(address + 10) = 0xE0FF;  // jmp *%rax
  *reinterpret_cast<volatile uint32_t*>(address + 0) =  // movabs $0, %rax
      0xB848 | (0xFFFF0000 & *reinterpret_cast<volatile uint32_t*>(address));
#endif  // SL_CPU_X86_64
  CHECK(0 == mprotect(page_address, page_size, PROT_READ | PROT_EXEC));
  CHECK(0 == pthread_sigmask(SIG_SETMASK, &saved_set, NULL));
}

const char* StartCpuProfiling(v8::Isolate* const isolate,
                              const uint64_t timeout_in_ms,
                              const uint64_t interval_in_ms) {
  CHECK(timeout_in_ms > 0);
  CHECK(interval_in_ms > 0);
  if (CpuProfiler::ForCurrentThread() != NULL) {
    return "profiler already running";
  }
  // See CpuProfile::Delete().
  CpuProfiler* const profiler = new CpuProfiler(isolate);
  profiler->Start(timeout_in_ms, interval_in_ms);
  return NULL;
}

static uint32_t watchdog_activation_count;

const CpuProfile* StopCpuProfiling(v8::Isolate*) {
  if (CpuProfiler* const profiler = CpuProfiler::ForCurrentThread()) {
    profiler->Stop();
    CHECK(profiler != CpuProfiler::ForCurrentThread());
    watchdog_activation_count += profiler->WatchdogActivationCount();
    return reinterpret_cast<const CpuProfile*>(profiler);
  }
  return NULL;
}

inline C::ReturnType StartCpuProfiling(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  int64_t timeout_in_ms = args[0]->IntegerValue();
  int64_t interval_in_ms = args[1]->IntegerValue();
  if (timeout_in_ms <= 0) timeout_in_ms = 1;
  if (interval_in_ms <= 0) interval_in_ms = 1;
  if (const char* error_message =
          StartCpuProfiling(args.GetIsolate(), timeout_in_ms, interval_in_ms)) {
    return handle_scope.Return(error_message);
  }
  return handle_scope.Return();
}

inline C::ReturnType StopCpuProfiling(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  v8::Isolate* const isolate = args.GetIsolate();
  const CpuProfile* const profile = StopCpuProfiling(isolate);
  if (profile == NULL) return handle_scope.Return();  // Not running.
  v8::Local<v8::Object> root = ToObject(isolate, profile->GetTopDownRoot());
  // See https://code.google.com/p/v8/issues/detail?id=3213.
  const_cast<CpuProfile*>(profile)->Delete();
  return handle_scope.Return(root);
}

inline C::ReturnType WatchdogActivationCount(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  if (CpuProfiler* const profiler = CpuProfiler::ForCurrentThread()) {
    return handle_scope.Return(profiler->WatchdogActivationCount());
  } else {
    const uint32_t value = watchdog_activation_count;
    watchdog_activation_count = 0;
    return handle_scope.Return(value);
  }
}

void Initialize(v8::Isolate* isolate, v8::Local<v8::Object> binding) {
  // See https://github.com/joyent/libuv/issues/1317.  We need to know when
  // the application enters epoll_wait() or kevent() but a bug in libuv makes
  // prepare handles unsuitable for that because they fire at the wrong time.
  HookSystemCall();
  StackFrameIterator::Initialize();
  binding->Set(
      C::String::NewFromUtf8(isolate, "startCpuProfiling"),
      C::FunctionTemplate::New(isolate, StartCpuProfiling)->GetFunction());
  binding->Set(
      C::String::NewFromUtf8(isolate, "stopCpuProfiling"),
      C::FunctionTemplate::New(isolate, StopCpuProfiling)->GetFunction());
  v8::Local<v8::FunctionTemplate> watchdog_activation_count_template =
      C::FunctionTemplate::New(isolate, WatchdogActivationCount);
  binding->Set(C::String::NewFromUtf8(isolate, "watchdogActivationCount"),
               watchdog_activation_count_template->GetFunction());
}

}  // namespace cpuprofiler
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_CPU_PROFILER_H_
