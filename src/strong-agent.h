// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_STRONG_AGENT_H_
#define AGENT_SRC_STRONG_AGENT_H_

#if defined(__APPLE__)
#include "TargetConditionals.h"
#endif

#define SL_COMPILER_CLANG 0
#define SL_COMPILER_GCC 0
#define SL_COMPILER_MSVC 0
#define SL_CPU_ARM 0
#define SL_CPU_ARM64 0
#define SL_CPU_ARM_HARDFP 0
#define SL_CPU_BIG_ENDIAN 0
#define SL_CPU_BIG_ENDIAN 0
#define SL_CPU_MIPS 0
#define SL_CPU_X86_64 0
#define SL_OS_FREEBSD 0
#define SL_OS_IOS 0
#define SL_OS_LINUX 0
#define SL_OS_MACOS 0
#define SL_OS_POSIX 0
#define SL_OS_SOLARIS 0
#define SL_OS_WINDOWS 0

#if defined(__clang__)
#undef SL_COMPILER_CLANG
#define SL_COMPILER_CLANG 1
#endif

#if defined(__GNUC__)
#undef SL_COMPILER_GCC
#define SL_COMPILER_GCC 1
#endif

#if defined(_MSC_VER)
#undef SL_COMPILER_MSVC
#define SL_COMPILER_MSVC 1
#endif

#if defined(__APPLE__) && TARGET_OS_IPHONE
#undef SL_OS_IOS
#define SL_OS_IOS 1
#endif

#if defined(__APPLE__) && TARGET_OS_MAC
#undef SL_OS_MACOS
#define SL_OS_MACOS 1
#endif

#if defined(__FreeBSD__)
#undef SL_OS_FREEBSD
#define SL_OS_FREEBSD 1
#endif

#if defined(__linux__)
#undef SL_OS_LINUX
#define SL_OS_LINUX 1
#endif

#if defined(_WIN32)
#undef SL_OS_WINDOWS
#define SL_OS_WINDOWS 1
#endif

#if defined(__sun)
#undef SL_OS_SOLARIS
#define SL_OS_SOLARIS 1
#endif

#if !SL_OS_WINDOWS
#undef SL_OS_POSIX
#define SL_OS_POSIX 1
#endif

#if defined(__arm__) || defined(_M_ARM)
#undef SL_CPU_ARM
#define SL_CPU_ARM 1
#endif

#if defined(__arm64__) || defined(__aarch64__)
#undef SL_CPU_ARM64
#define SL_CPU_ARM64 1
#endif

#if defined(__mips__)
#undef SL_CPU_MIPS
#define SL_CPU_MIPS 1
#endif

#if defined(__x86_64__) || defined(_M_X64)
#undef SL_CPU_X86_64
#define SL_CPU_X86_64 1
#endif

#if SL_CPU_ARM && defined(__ARM_PCS_VFP)
#undef SL_CPU_ARM_HARDFP
#define SL_CPU_ARM_HARDFP 1
#endif

#if SL_CPU_ARM && defined(__ARMEB__)
#undef SL_CPU_BIG_ENDIAN
#define SL_CPU_BIG_ENDIAN 1
#endif

#if SL_CPU_MIPS && defined(__MIPSEB__)
#undef SL_CPU_BIG_ENDIAN
#define SL_CPU_BIG_ENDIAN 1
#endif

#if SL_COMPILER_CLANG
#define SL_CLANG_AT_LEAST(major, minor, patch)             \
  (__clang_major__ > major ||                              \
   __clang_major__ == major && __clang_minor__ > minor ||  \
   __clang_major__ == major && __clang_minor__ == minor && \
       __clang_patchlevel__ >= patch)
#else
#define SL_CLANG_AT_LEAST(major, minor, patch) 0
#endif

#if SL_COMPILER_GCC
#define SL_GCC_AT_LEAST(major, minor, patch)                          \
  (__GNUC__ > major || __GNUC__ == major && __GNUC_MINOR__ > minor || \
   __GNUC__ == major && __GNUC_MINOR__ == minor &&                    \
       __GNUC_PATCHLEVEL__ >= patch)
#else
#define SL_GCC_AT_LEAST(major, minor, patch) 0
#endif

// Can't use `#pragma GCC diagnostic push/pop`, not supported by gcc 4.2.
#if SL_COMPILER_GCC
#pragma GCC diagnostic ignored "-Wunused-parameter"
#if SL_GCC_AT_LEAST(4, 8, 0)
#pragma GCC diagnostic ignored "-Wunused-local-typedefs"
#endif
#endif

#include "node.h"
#include "uv.h"
#include "v8.h"
#include "v8-profiler.h"

#if SL_COMPILER_GCC
#if SL_GCC_AT_LEAST(4, 8, 0)
#pragma GCC diagnostic warning "-Wunused-local-typedefs"
#endif
#pragma GCC diagnostic warning "-Wunused-parameter"
#endif

#if SL_OS_POSIX
#include "platform-posix.h"
#elif SL_OS_WINDOWS
#include "platform-win32.h"
#endif

#include "queue.h"
#include "util.h"
#include "util-inl.h"

#include "compat.h"
#include "compat-inl.h"

namespace strongloop {
namespace agent {

#define SL_INDEXED_PROPERTIES_MAP(V) \
  V(kCountersCallback)               \
  V(kCountersObject)                 \
  V(kGarbageCollectorStatisticsCallback)

enum IndexedProperties {
#define V(name) name,
  SL_INDEXED_PROPERTIES_MAP(V) kMaxIndexedProperties
#undef V
};

class WakeUp {
 public:
  typedef void (*Callback)(WakeUp* w);
  inline static void Initialize();
  inline explicit WakeUp(Callback callback);
  inline ~WakeUp();
  inline bool Start();
  inline bool Stop();

 private:
  inline static void OnIdle(::uv_idle_t*);
  WakeUp(const WakeUp&);
  void operator=(const WakeUp&);
  Callback const callback_;
  ::QUEUE queue_;
  static ::uv_idle_t idle_handle;
  static ::QUEUE pending_queue;
};

inline v8::Local<v8::Object> GetBindingObject(v8::Isolate* isolate);

namespace counters {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace counters

namespace dyninst {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace dyninst

namespace extras {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace extras

namespace gcinfo {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace gcinfo

namespace heapdiff {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace heapdiff

namespace profiler {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace profiler

namespace uvmon {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
}  // namespace uvmon

namespace watchdog {
void Initialize(v8::Isolate*, v8::Local<v8::Object>);
const char* StartCpuProfiling(v8::Isolate* isolate, uint64_t timeout);
const v8::CpuProfile* StopCpuProfiling(v8::Isolate* isolate);
}  // namespace watchdog

namespace platform {
void CpuTime(double* total_system, double* total_user);
}  // namespace platform

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_STRONG_AGENT_H_
