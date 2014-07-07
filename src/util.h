// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_UTIL_H_
#define AGENT_SRC_UTIL_H_

#include "strong-agent.h"
#include <stddef.h>

namespace strongloop {
namespace agent {

template <typename T, size_t N>
size_t ArraySize(const T (&a)[N]);

template <typename T>
int Compare(const T* a, const T* b, size_t size);

template <typename T>
T* Copy(T* to, const T* from, size_t size);

// For squelching warnings about unused parameters/variables.
template <typename T>
void Use(const T&);

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_UTIL_H_
