// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_STRONG_AGENT_H_
#define AGENT_SRC_STRONG_AGENT_H_

#include "features.h"

// Can't use `#pragma GCC diagnostic push/pop`, not supported by gcc 4.2.
#if defined(SL_COMPILER_GCC)
#pragma GCC diagnostic ignored "-Wunused-parameter"
#if SL_GCC_AT_LEAST(4, 8, 0)
#pragma GCC diagnostic ignored "-Wunused-local-typedefs"
#endif
#endif

#include "node.h"
#include "uv.h"
#include "v8.h"
#include "v8-profiler.h"

#if defined(SL_COMPILER_GCC)
#if SL_GCC_AT_LEAST(4, 8, 0)
#pragma GCC diagnostic warning "-Wunused-local-typedefs"
#endif
#pragma GCC diagnostic warning "-Wunused-parameter"
#endif

#if defined(SL_OS_POSIX)
#include "platform-posix.h"
#elif defined(SL_OS_WINDOWS)
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
