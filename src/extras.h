// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_EXTRAS_H_
#define AGENT_SRC_EXTRAS_H_

#include "strong-agent.h"

namespace strongloop {
namespace agent {
namespace extras {

namespace C = ::compat;

using v8::Array;
using v8::FunctionTemplate;
using v8::Isolate;
using v8::Local;
using v8::Object;

C::ReturnType CpuTime(const C::ArgumentType& args) {
  double total_user = 0;
  double total_system = 0;
  platform::CpuTime(&total_user, &total_system);
  C::ReturnableHandleScope handle_scope(args);
  Isolate* isolate = args.GetIsolate();
  Local<Array> result = C::Array::New(isolate, 2);
  result->Set(0, C::Number::New(isolate, total_user));
  result->Set(1, C::Number::New(isolate, total_system));
  return handle_scope.Return(result);
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  binding->Set(C::String::NewFromUtf8(isolate, "cputime"),
               C::FunctionTemplate::New(isolate, CpuTime)->GetFunction());
}

}  // namespace extras
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_EXTRAS_H_
