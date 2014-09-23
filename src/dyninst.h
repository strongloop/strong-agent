// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_DYNINST_H_
#define AGENT_SRC_DYNINST_H_

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
using v8::Value;

C::ReturnType RunInDebugContext(const C::ArgumentType& args) {
  C::ReturnableHandleScope handle_scope(args);
  Local<Context> context = Debug::GetDebugContext();
  Context::Scope context_scope(context);
  Local<Script> script = Script::Compile(args[0]->ToString());
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
