// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#include "strong-agent.h"
#include "counters.h"
#include "dyninst.h"
#include "extras.h"
#include "gcinfo.h"
#include "heapdiff.h"
#include "profiler.h"
#include "queue.h"
#include "uvmon.h"
#include "watchdog.h"

namespace strongloop {
namespace agent {

namespace C = ::compat;

using v8::Isolate;
using v8::Local;
using v8::Object;

static C::Persistent<Object> binding_object;

::uv_idle_t WakeUp::idle_handle;
::QUEUE WakeUp::pending_queue;

WakeUp::WakeUp(Callback callback) : callback_(callback) { QUEUE_INIT(&queue_); }

WakeUp::~WakeUp() { QUEUE_REMOVE(&queue_); }

void WakeUp::Initialize() {
  ::uv_idle_init(::uv_default_loop(), &idle_handle);
  ::uv_unref(reinterpret_cast<uv_handle_t*>(&idle_handle));
  QUEUE_INIT(&pending_queue);
}

bool WakeUp::Start() {
  if (QUEUE_EMPTY(&queue_) == false) {
    return false;
  }
  if (QUEUE_EMPTY(&pending_queue) == true) {
    ::uv_idle_start(&idle_handle,
                    reinterpret_cast</*nodigraph*/ ::uv_idle_cb>(OnIdle));
  }
  QUEUE_INSERT_TAIL(&pending_queue, &queue_);
  return true;
}

bool WakeUp::Stop() {
  if (QUEUE_EMPTY(&queue_) == true) {
    return false;
  }
  QUEUE_REMOVE(&queue_);
  QUEUE_INIT(&queue_);
  if (QUEUE_EMPTY(&pending_queue) == true) {
    ::uv_idle_stop(&idle_handle);
  }
  return true;
}

void WakeUp::OnIdle(::uv_idle_t*) {
  ::uv_idle_stop(&idle_handle);
  if (QUEUE_EMPTY(&pending_queue)) {
    return;
  }
  QUEUE queue;
  QUEUE* const q = QUEUE_HEAD(&pending_queue);
  QUEUE_SPLIT(&pending_queue, q, &queue);
  while (QUEUE_EMPTY(&queue) == false) {
    QUEUE* const q = QUEUE_HEAD(&queue);
    QUEUE_REMOVE(q);
    QUEUE_INIT(q);
    WakeUp* const w = QUEUE_DATA(q, WakeUp, queue_);
    w->callback_(w);
  }
}

Local<Object> GetBindingObject(Isolate* isolate) {
  return binding_object.ToLocal(isolate);
}

void Initialize(Local<Object> binding) {
  Isolate* isolate = Isolate::GetCurrent();
  WakeUp::Initialize();
  binding_object.Reset(isolate, binding);
  counters::Initialize(isolate, binding);
  dyninst::Initialize(isolate, binding);
  extras::Initialize(isolate, binding);
  gcinfo::Initialize(isolate, binding);
  heapdiff::Initialize(isolate, binding);
  profiler::Initialize(isolate, binding);
  uvmon::Initialize(isolate, binding);
  watchdog::Initialize(isolate, binding);
#define V(name)                                        \
  binding->Set(C::String::NewFromUtf8(isolate, #name), \
               C::Integer::New(isolate, name));
  SL_INDEXED_PROPERTIES_MAP(V)
#undef V
}

// See https://github.com/joyent/node/pull/7240.  Need to make the module
// definition externally visible when compiling with -fvisibility=hidden.
// Doesn't apply to v0.11, it uses a constructor to register the module.
#if !NODE_VERSION_AT_LEAST(0, 11, 0) && \
    (defined(SL_COMPILER_CLANG) || defined(SL_COMPILER_GCC))
extern "C" __attribute__((visibility("default"))) node::node_module_struct
    strong_agent_module;
#endif

NODE_MODULE(strong_agent, Initialize)

}  // namespace agent
}  // namespace strongloop
