// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_GCINFO_H_
#define AGENT_SRC_GCINFO_H_

#include "strong-agent.h"
#include "queue.h"

namespace strongloop {
namespace agent {
namespace gcinfo {

namespace C = compat;

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
using v8::kGCCallbackFlagCompacted;
#if SL_NODE_VERSION == 12
using v8::kGCCallbackFlagConstructRetainedObjectInfos;
using v8::kGCCallbackFlagForced;
#endif
using v8::kGCTypeAll;
using v8::kGCTypeMarkSweepCompact;
using v8::kGCTypeScavenge;
using v8::kNoGCCallbackFlags;

class Baton {
 public:
  static Baton* New(Isolate* isolate, GCType type, GCCallbackFlags flags);
  static Baton* Pop();
  GCType type() const;
  GCCallbackFlags flags() const;
  const char* type_string() const;
  const char* flags_string() const;
  HeapStatistics* heap_statistics() const;
  void Dispose();
 private:
  Baton(Isolate* isolate, GCType type, GCCallbackFlags flags);
  // Only allow deletion through Baton::Dispose().
  ~Baton();
  // Forbid copy and assigment.
  Baton(const Baton&);
  void operator=(const Baton&);
  static QUEUE baton_queue;
  QUEUE baton_queue_;
  GCType type_;
  GCCallbackFlags flags_;
  HeapStatistics heap_statistics_;
};

C::Persistent<Function> on_gc_callback;
uv_idle_t idle_handle;

QUEUE Baton::baton_queue = { &Baton::baton_queue, &Baton::baton_queue };

Baton* Baton::Pop() {
  if (QUEUE_EMPTY(&baton_queue)) {
    return static_cast<Baton*>(0);
  }
  QUEUE* q = QUEUE_HEAD(&baton_queue);
  QUEUE_REMOVE(q);
  return QUEUE_DATA(q, Baton, baton_queue_);
}

Baton* Baton::New(Isolate* isolate, GCType type, GCCallbackFlags flags) {
  Baton* baton = new Baton(isolate, type, flags);
  QUEUE_INSERT_TAIL(&baton_queue, &baton->baton_queue_);
  return baton;
}

Baton::Baton(Isolate* isolate, GCType type, GCCallbackFlags flags)
    : type_(type), flags_(flags) {
#if SL_NODE_VERSION == 10
  Use(isolate);
  V8::GetHeapStatistics(&heap_statistics_);
#elif SL_NODE_VERSION == 12
  isolate->GetHeapStatistics(&heap_statistics_);
#endif
  QUEUE_INIT(&baton_queue_);
}

Baton::~Baton() {
}

GCType Baton::type() const {
  return type_;
}

GCCallbackFlags Baton::flags() const {
  return flags_;
}

HeapStatistics* Baton::heap_statistics() const {
  // HeapStatistics is a getters-only class but its getters aren't marked const.
  return const_cast<HeapStatistics*>(&heap_statistics_);
}

const char* Baton::type_string() const {
  switch (type()) {
#define V(name) case name: return #name
    V(kGCTypeAll);
    V(kGCTypeScavenge);
    V(kGCTypeMarkSweepCompact);
#undef V
  }
  return "UnknownType";
}

const char* Baton::flags_string() const {
  switch (flags()) {
#define V(name) case name: return #name
    V(kNoGCCallbackFlags);
    V(kGCCallbackFlagCompacted);
#if SL_NODE_VERSION == 12
    V(kGCCallbackFlagForced);
    V(kGCCallbackFlagConstructRetainedObjectInfos);
#endif
#undef V
  }
  return "UnknownFlags";
}

void Baton::Dispose() {
  delete this;
}

void OnIdle(uv_idle_t*) {  // NOLINT(readability/function)
  Isolate* isolate = Isolate::GetCurrent();  // FIXME(bnoordhuis)
  C::HandleScope handle_scope(isolate);
  uv_idle_stop(&idle_handle);
  while (Baton* baton = Baton::Pop()) {
    if (on_gc_callback.IsEmpty() == false) {
      const size_t used_heap_size = baton->heap_statistics()->used_heap_size();
      Local<Value> arg = C::Integer::NewFromUnsigned(isolate, used_heap_size);
      Local<Function> fun = on_gc_callback.ToLocal(isolate);
      fun->Call(fun, 1, &arg);
    }
    baton->Dispose();
  }
}

void AfterGC(GCType type, GCCallbackFlags flags) {
  Baton::New(Isolate::GetCurrent(), type, flags);
  uv_idle_start(&idle_handle, reinterpret_cast<uv_idle_cb>(OnIdle));
}

C::ReturnType OnGC(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  if (on_gc_callback.IsEmpty() == false) {
    on_gc_callback.Reset();
    V8::RemoveGCEpilogueCallback(AfterGC);
  }
  if (args[0]->IsFunction() == true) {
    on_gc_callback.Reset(isolate, args[0].As<Function>());
    V8::AddGCEpilogueCallback(AfterGC);
  }
  return handle_scope.Return();
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  uv_idle_init(uv_default_loop(), &idle_handle);
  uv_unref(reinterpret_cast<uv_handle_t*>(&idle_handle));
  binding->Set(C::String::NewFromUtf8(isolate, "onGC"),
               C::FunctionTemplate::New(isolate, OnGC)->GetFunction());
}

}  // namespace gcinfo
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_GCINFO_H_
