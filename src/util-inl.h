// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_UTIL_INL_H_
#define AGENT_SRC_UTIL_INL_H_

#include "strong-agent.h"
#include <string.h>

namespace strongloop {
namespace agent {

template <typename T, size_t N>
size_t ArraySize(const T (&)[N]) {
  return N;
}

template <typename T>
T* Copy(T* to, const T* from, size_t size) {
  void* ptr = ::memcpy(to, from, size * sizeof(*to));  // NOLINT(runtime/memcpy)
  return static_cast<T*>(ptr);
}

template <typename T>
int Compare(const T* a, const T* b, size_t size) {
  return ::memcmp(a, b, size * sizeof(*a));  // NOLINT(runtime/memcmp)
}

template <typename T>
void Use(const T&) {
}

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_UTIL_INL_H_
