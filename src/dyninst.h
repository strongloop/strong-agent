// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_DYNINST_H_
#define AGENT_SRC_DYNINST_H_

#include "node_version.h"
#include "strong-agent.h"
#include "v8-debug.h"

namespace strongloop {
namespace agent {
namespace dyninst {

namespace C = compat;

using v8::Context;
using v8::Debug;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::Script;
using v8::String;
using v8::Value;

C::ReturnType RunInDebugContext(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  Local<String> source = args[0]->ToString();
  Local<Context> context = Debug::GetDebugContext();
#if NODE_MAJOR_VERSION > 0
  if (context.IsEmpty()) {
    // Force-load the debug context.
    Debug::GetMirror(args.GetIsolate()->GetCurrentContext(), source);
    context = Debug::GetDebugContext();
  }
#endif
  CHECK_EQ(false, context.IsEmpty());
  Context::Scope context_scope(context);
  Local<Script> script = Script::Compile(source);
  CHECK_EQ(false, script.IsEmpty());
  Local<Value> return_value = script->Run();
  CHECK_EQ(false, return_value.IsEmpty());
  return handle_scope.Return(return_value);
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  binding->Set(
      C::String::NewFromUtf8(isolate, "runInDebugContext"),
      C::FunctionTemplate::New(isolate, RunInDebugContext)->GetFunction());
}

}  // namespace dyninst
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_DYNINST_H_
