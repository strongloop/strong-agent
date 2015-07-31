// Copyright (c) 2015, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_BASIC_CPU_PROFILER_H_
#define AGENT_SRC_BASIC_CPU_PROFILER_H_

#include "strong-agent.h"
#include "cpu-profiler-util.h"

namespace strongloop {
namespace agent {
namespace cpuprofiler {

namespace C = ::compat;

const char* StartCpuProfiling(v8::Isolate* const isolate,
                              const uint64_t timeout_in_ms,
                              const uint64_t interval_in_ms) {
  CHECK(timeout_in_ms > 0);
  CHECK(interval_in_ms > 0);
  if (timeout_in_ms != 1 || interval_in_ms != 1) {
    return "watchdog profiling not supported on this platform";
  }
  C::CpuProfiler::StartCpuProfiling(isolate);
  return NULL;
}

const v8::CpuProfile* StopCpuProfiling(v8::Isolate* const isolate) {
  return C::CpuProfiler::StopCpuProfiling(isolate);
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
  const v8::CpuProfile* const profile = StopCpuProfiling(isolate);
  if (profile == NULL) return handle_scope.Return();  // Not running.
  v8::Local<v8::Object> root = ToObject(isolate, profile->GetTopDownRoot());
  // See https://code.google.com/p/v8/issues/detail?id=3213.
  const_cast<v8::CpuProfile*>(profile)->Delete();
  return handle_scope.Return(root);
}

void Initialize(v8::Isolate* const isolate, v8::Local<v8::Object> binding) {
  binding->Set(
      C::String::NewFromUtf8(isolate, "startCpuProfiling"),
      C::FunctionTemplate::New(isolate, StartCpuProfiling)->GetFunction());
  binding->Set(
      C::String::NewFromUtf8(isolate, "stopCpuProfiling"),
      C::FunctionTemplate::New(isolate, StopCpuProfiling)->GetFunction());
}

}  // namespace cpuprofiler
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_BASIC_CPU_PROFILER_H_
