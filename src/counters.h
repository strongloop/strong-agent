// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_COUNTERS_H_
#define AGENT_SRC_COUNTERS_H_

#include "strong-agent.h"
#include "util.h"
#include "util-inl.h"
#include "uv.h"

#include <vector>

#if !NODE_VERSION_AT_LEAST(0, 11, 0)
#define AT_LEAST_V8_3_26(exp)
#define AT_MOST_V8_3_14(exp) exp
#else
#define AT_LEAST_V8_3_26(exp) exp
#define AT_MOST_V8_3_14(exp)
#endif

// See the lists in deps/v8/src/counters.h and deps/v8/src/v8-counters.h.
// Note that not all counters in that file are useful or even in use.
// When in doubt, consult the V8 source.

// Besides GCCompactor and GCScavenger, there's also GCContext but that is only
// incremented inside IdleNotification() when ContextDisposedNotification() has
// been called first.  Since Node.js does neither, it's not included here.
#define HISTOGRAM_TIMER_LIST(V) \
  V(GCCompactor)                \
  V(GCScavenger)

// Properties that are clamped to the range 0-100 inclusive.
#define HISTOGRAM_PERCENTAGE_LIST(V)                                \
  AT_LEAST_V8_3_26(V(MemoryExternalFragmentationPropertyCellSpace)) \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionCodeSpace))                  \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionLoSpace))                    \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionNewSpace))                   \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionOldDataSpace))               \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionOldPointerSpace))            \
  AT_LEAST_V8_3_26(V(MemoryHeapFractionPropertyCellSpace))          \
  AT_LEAST_V8_3_26(V(MemoryHeapSampleCodeSpaceCommitted))           \
  AT_LEAST_V8_3_26(V(MemoryHeapSampleMaximumCommitted))             \
  AT_LEAST_V8_3_26(V(MemoryHeapSamplePropertyCellSpaceCommitted))   \
  AT_LEAST_V8_3_26(V(MemoryPropertyCellSpaceBytesAvailable))        \
  AT_LEAST_V8_3_26(V(MemoryPropertyCellSpaceBytesCommitted))        \
  AT_LEAST_V8_3_26(V(MemoryPropertyCellSpaceBytesUsed))             \
  V(MemoryExternalFragmentationCellSpace)                           \
  V(MemoryExternalFragmentationCodeSpace)                           \
  V(MemoryExternalFragmentationLoSpace)                             \
  V(MemoryExternalFragmentationMapSpace)                            \
  V(MemoryExternalFragmentationOldDataSpace)                        \
  V(MemoryExternalFragmentationOldPointerSpace)                     \
  V(MemoryExternalFragmentationTotal)                               \
  V(MemoryHeapFractionCellSpace)                                    \
  V(MemoryHeapFractionMapSpace)

// Emitted in the GC epilogue.  Random observations:
//
// - MemoryHeapSampleCellSpaceCommitted and MemoryHeapSampleMapSpaceCommitted
//   have been omitted.  They are versions of MemoryCellSpaceBytesCommitted and
//   MemoryMapSpaceBytesCommitted expressed in kilobytes, i.e. redundant.
#define HISTOGRAM_MEMORY_LIST(V)    \
  V(MemoryHeapSampleTotalCommitted) \
  V(MemoryHeapSampleTotalUsed)

// Random observations:
//
// - TotalEvalSize is the sum of `eval(code)` and `new Function(code)`.
//
// - TotalLoadSize is the sum of code evaluated with v8::Script::Compile().
//
// - TotalCompileSize however is not the sum of TotalEvalSize and TotalLoadSize,
//   it also includes lazy (re)compilation.
//
// - SymbolTableCapacity is not very interesting in itself but because it has
//   a close relationship with NumberOfSymbols, comparing the two over time
//   might yield interesting data.
//
// - StringConstructorCalls and friends are potentially interesting but don't
//   emit data unless node is started with --native_code_counters, hence they
//   have been omitted.
//
// - The previous point is also an argument for adding StringAddRuntime and
//   friends.  Without their native counterparts (StringAddNative, etc.),
//   it's hard to draw meaningful comparisons.
//
// - I left out StackInterrupts because there is no good way to tell what
//   generates the interrupts.  We could perhaps compensate for profiler ticks,
//   GC requests, parallel recompiles, etc. (all interrupt sources) but I don't
//   think the metric is interesting enough to go through all that trouble.
//
// Caveat emptor: embedders are supposed to call SetCreateHistogramFunction()
// right after initialization but of course the add-on is loaded much later
// so we don't have an opportunity to do that.  As a result, some counters
// may not get reported because V8 thinks the embedder is not interested.
// For example, we could drop gcinfo.h if V8.AliveAfterLastGC metrics
// were reported - but alas, they are not.
#define STATS_COUNTER_LIST(V)                        \
  AT_MOST_V8_3_14(V(GCCompactorCausedByWeakHandles)) \
  V(AliveAfterLastGC)                                \
  V(GCCompactorCausedByOldspaceExhaustion)           \
  V(GCCompactorCausedByPromotedData)                 \
  V(GCCompactorCausedByRequest)                      \
  V(GCLastResortFromHandles)                         \
  V(GCLastResortFromJS)                              \
  V(GlobalHandles)                                   \
  V(MemoryCellSpaceBytesAvailable)                   \
  V(MemoryCellSpaceBytesCommitted)                   \
  V(MemoryCellSpaceBytesUsed)                        \
  V(MemoryCodeSpaceBytesAvailable)                   \
  V(MemoryCodeSpaceBytesCommitted)                   \
  V(MemoryCodeSpaceBytesUsed)                        \
  V(MemoryLoSpaceBytesAvailable)                     \
  V(MemoryLoSpaceBytesCommitted)                     \
  V(MemoryLoSpaceBytesUsed)                          \
  V(MemoryMapSpaceBytesAvailable)                    \
  V(MemoryMapSpaceBytesCommitted)                    \
  V(MemoryMapSpaceBytesUsed)                         \
  V(MemoryNewSpaceBytesAvailable)                    \
  V(MemoryNewSpaceBytesCommitted)                    \
  V(MemoryNewSpaceBytesUsed)                         \
  V(MemoryOldDataSpaceBytesAvailable)                \
  V(MemoryOldDataSpaceBytesCommitted)                \
  V(MemoryOldDataSpaceBytesUsed)                     \
  V(MemoryOldPointerSpaceBytesAvailable)             \
  V(MemoryOldPointerSpaceBytesCommitted)             \
  V(MemoryOldPointerSpaceBytesUsed)                  \
  V(NumberOfSymbols)                                 \
  V(ObjsSinceLastFull)                               \
  V(ObjsSinceLastYoung)                              \
  V(OsMemoryAllocated)                               \
  V(StoreBufferCompactions)                          \
  V(StoreBufferOverflows)                            \
  V(SymbolTableCapacity)                             \
  V(TotalCompileSize)                                \
  V(TotalCompiledCodeSize)

#define ALL_METRICS_LIST(V)    \
  HISTOGRAM_TIMER_LIST(V)      \
  HISTOGRAM_PERCENTAGE_LIST(V) \
  HISTOGRAM_MEMORY_LIST(V)     \
  STATS_COUNTER_LIST(V)

namespace strongloop {
namespace agent {
namespace counters {

namespace C = ::compat;

using v8::Function;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Value;
using v8::kExternalIntArray;

#define V(name) k##name,
enum Kind { ALL_METRICS_LIST(V) kMaxKind };
#undef V

// |samples| is exposed to JS land as a typed array-ish object.
// Odd sample indices are kinds (see the Kind enum), even
// indices are the samples themselves.  Perhaps we should
// extend that in the future to include timestamps.
static std::vector<int32_t> samples;
static Lazy<WakeUp> wakeup;

inline void ResetSamples() {
  samples.clear();
  samples.reserve(8192);
}

inline void* CreateHistogramFunction(const char* name, int /* min */,
                                     int /* max */, size_t /* buckets */) {
  static const char prefix[] = "V8.";
  static const size_t prefix_size = sizeof(prefix) - 1;
  const size_t size = ::strlen(name);
  if (size <= prefix_size || 0 != Compare(name, prefix, prefix_size)) {
    return NULL;  // Not interested.
  }
// Mild ISO C++ violation: we return an enum cast to a void pointer.
// The pointer is not dereferenced by us or V8, it's just an identifier.
#define V(name_)                                                      \
  if (size == sizeof(#name_) + prefix_size - 1 &&                     \
      0 == Compare(name + prefix_size, #name_, size - prefix_size)) { \
    return reinterpret_cast<void*>(static_cast<uintptr_t>(k##name_)); \
  }
  ALL_METRICS_LIST(V);
#undef V
  return NULL;  // Not interested.
}

inline void AddHistogramSampleFunction(void* histogram, int sample) {
  const Kind kind = static_cast<Kind>(reinterpret_cast<uintptr_t>(histogram));
  samples.push_back(int32_t(kind));
  samples.push_back(sample);
  wakeup->Start();
}

inline void OnWakeUp(WakeUp*) {  // NOLINT(readability/function)
  if (samples.empty()) return;   // Stopped.
  Isolate* const isolate = Isolate::GetCurrent();
  C::HandleScope handle_scope(isolate);
  do {
    Local<Object> binding_object = GetBindingObject(isolate);
    Local<Value> counters_object_v = binding_object->Get(kCountersObject);
    if (counters_object_v->IsObject() == false) break;
    Local<Object> counters_object = counters_object_v.As<Object>();
    void* const actual =
        counters_object->GetIndexedPropertiesExternalArrayData();
    void* const expected = static_cast<void*>(&samples[0]);
    if (actual != expected) {
      counters_object->SetIndexedPropertiesToExternalArrayData(
          expected, kExternalIntArray, samples.capacity());
    }
    Local<Value> callback_v = binding_object->Get(kCountersCallback);
    if (callback_v->IsFunction() == false) break;
    Local<Function> callback = callback_v.As<Function>();
    Local<Value> args[] = {
        counters_object, C::Integer::NewFromUnsigned(isolate, samples.size())};
    callback->Call(binding_object, ArraySize(args), args);
  } while (false);
  ResetSamples();
}

C::ReturnType StartCounters(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  C::Isolate::SetAddHistogramSampleFunction(args.GetIsolate(),
                                            AddHistogramSampleFunction);
  ResetSamples();
  return handle_scope.Return();
}

C::ReturnType StopCounters(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  C::Isolate::SetAddHistogramSampleFunction(args.GetIsolate(), NULL);
  ResetSamples();
  wakeup->Stop();
  return handle_scope.Return();
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  wakeup.Initialize(OnWakeUp);
  C::Isolate::SetCreateHistogramFunction(isolate, CreateHistogramFunction);
  // Not really necessary to expose but makes for easier introspection.
  binding->Set(C::String::NewFromUtf8(isolate, "startCounters"),
               C::FunctionTemplate::New(isolate, StartCounters)->GetFunction());
  binding->Set(C::String::NewFromUtf8(isolate, "stopCounters"),
               C::FunctionTemplate::New(isolate, StopCounters)->GetFunction());
  binding->Set(kCountersObject, C::Object::New(isolate));
  Local<Object> counters = C::Object::New(isolate);
#define V(name)                                         \
  counters->Set(C::String::NewFromUtf8(isolate, #name), \
                C::Integer::NewFromUnsigned(isolate, k##name));
  ALL_METRICS_LIST(V)
#undef V
  binding->Set(C::String::NewFromUtf8(isolate, "counters"), counters);
}

}  // namespace counters
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_COUNTERS_H_
