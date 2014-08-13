// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#include "strong-agent.h"
#include "extras.h"
#include "gcinfo.h"
#include "heapdiff.h"
#include "profiler.h"
#include "uvmon.h"

namespace strongloop {
namespace agent {

namespace C = compat;

using v8::Isolate;
using v8::Local;
using v8::Object;

static C::Persistent<Object> binding_object;

Local<Object> GetBindingObject(Isolate* isolate) {
  return binding_object.ToLocal(isolate);
}

void Initialize(Local<Object> binding) {
  Isolate* isolate = Isolate::GetCurrent();
  binding_object.Reset(isolate, binding);
  extras::Initialize(isolate, binding);
  gcinfo::Initialize(isolate, binding);
  heapdiff::Initialize(isolate, binding);
  profiler::Initialize(isolate, binding);
  uvmon::Initialize(isolate, binding);
#define V(name) binding->Set(C::String::NewFromUtf8(isolate, #name),          \
                             C::Integer::New(isolate, name));
  SL_CALLBACK_PROPERTIES_MAP(V)
#undef V
}

// See https://github.com/joyent/node/pull/7240.  Need to make the module
// definition externally visible when compiling with -fvisibility=hidden.
// Doesn't apply to v0.11, it uses a constructor to register the module.
#if defined(__GNUC__) && SL_NODE_VERSION == 10
extern "C" __attribute__((visibility("default")))
node::node_module_struct strong_agent_module;
#endif

NODE_MODULE(strong_agent, Initialize)

}  // namespace agent
}  // namespace strongloop
