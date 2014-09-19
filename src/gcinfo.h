// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_GCINFO_H_
#define AGENT_SRC_GCINFO_H_

#include "strong-agent.h"
#include "util.h"
#include "util-inl.h"

#include <vector>

namespace strongloop {
namespace agent {
namespace gcinfo {

namespace C = ::compat;

using v8::Array;
using v8::Function;
using v8::GCCallbackFlags;
using v8::GCType;
using v8::Handle;
using v8::HeapStatistics;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::V8;
using v8::Value;

static std::vector<size_t> samples;
static Lazy<WakeUp> wakeup;

inline void OnWakeUp(WakeUp*) {  // NOLINT(readability/function)
  Isolate* const isolate = Isolate::GetCurrent();
  C::HandleScope handle_scope(isolate);
  const size_t size = samples.size();
  Local<Array> array = C::Array::New(isolate, size);
  for (size_t index = 0; index < size; index += 1) {
    array->Set(index, C::Integer::NewFromUnsigned(isolate, samples[index]));
  }
  samples.clear();
  Local<Object> binding_object = GetBindingObject(isolate);
  Local<Value> property_value =
      binding_object->Get(kGarbageCollectorStatisticsCallback);
  if (property_value->IsFunction() == true) {
    Local<Value> argv[] = {array};
    property_value.As<Function>()->Call(binding_object, ArraySize(argv), argv);
  }
}

void AfterGC(GCType, GCCallbackFlags) {
  HeapStatistics stats;
  Isolate* const isolate = Isolate::GetCurrent();
  C::Isolate::GetHeapStatistics(isolate, &stats);
  samples.push_back(stats.used_heap_size());
  wakeup->Start();
}

C::ReturnType StartGarbageCollectorStatistics(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  V8::AddGCEpilogueCallback(AfterGC);
  return handle_scope.Return();
}

C::ReturnType StopGarbageCollectorStatistics(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  V8::RemoveGCEpilogueCallback(AfterGC);
  return handle_scope.Return();
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  wakeup.Initialize(OnWakeUp);
  binding->Set(
      C::String::NewFromUtf8(isolate, "startGarbageCollectorStatistics"),
      C::FunctionTemplate::New(isolate, StartGarbageCollectorStatistics)
          ->GetFunction());
  binding->Set(
      C::String::NewFromUtf8(isolate, "stopGarbageCollectorStatistics"),
      C::FunctionTemplate::New(isolate, StopGarbageCollectorStatistics)
          ->GetFunction());
}

}  // namespace gcinfo
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_GCINFO_H_
