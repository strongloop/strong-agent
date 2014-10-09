// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_UVMON_H_
#define AGENT_SRC_UVMON_H_

#include "strong-agent.h"

namespace strongloop {
namespace agent {
namespace uvmon {

namespace C = ::compat;

using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::kExternalUnsignedIntArray;

uv_check_t check_handle;
uint32_t statistics[4];
uint32_t& min = statistics[0];
uint32_t& max = statistics[1];
uint32_t& num = statistics[2];
uint32_t& sum = statistics[3];

void OnCheck(uv_check_t* handle) {
  const uv_loop_t* const loop = handle->loop;
  const uint64_t now = uv_hrtime() / static_cast<uint64_t>(1e6);
  const uint32_t delta =
      static_cast<uint32_t>(now <= loop->time ? 0 : (now - loop->time));
  if (delta < min) {
    min = delta;
  }
  if (delta > max) {
    max = delta;
  }
  num += 1;
  sum += delta;
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  uv_check_init(uv_default_loop(), &check_handle);
  uv_check_start(&check_handle, reinterpret_cast<uv_check_cb>(OnCheck));
  uv_unref(reinterpret_cast<uv_handle_t*>(&check_handle));
  Local<Object> event_loop_statistics = C::Object::New(isolate);
  event_loop_statistics->SetIndexedPropertiesToExternalArrayData(
      statistics, kExternalUnsignedIntArray, ArraySize(statistics));
  binding->Set(C::String::NewFromUtf8(isolate, "eventLoopStatistics"),
               event_loop_statistics);
}

}  // namespace uvmon
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_UVMON_H_
