// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_UTIL_INL_H_
#define AGENT_SRC_UTIL_INL_H_

#include "strong-agent.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

namespace strongloop {
namespace agent {

template <typename T>
void Assert(const T& result, const char* expression) {
#if defined(NDEBUG)
  Use(result);
  Use(expression);
#else
  Check(result, expression);
#endif
}

template <typename T, size_t N>
size_t ArraySize(const T(&)[N]) {
  return N;
}

template <typename T>
void Check(const T& result, const char* expression) {
  if (result == false) {
    ::fprintf(stderr, "CHECK failed: %s\n", expression);
    ::fflush(stderr);
    ::abort();
  }
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
void Use(const T&) {}

template <typename T>
Lazy<T>::Lazy()
    : initialized_(false) {}

template <typename T>
Lazy<T>::~Lazy() {
  if (initialized()) Dispose();
}

template <typename T>
T* Lazy<T>::operator->() {
  return address();
}

template <typename T>
T& Lazy<T>::operator*() {
  return *address();
}

template <typename T>
void Lazy<T>::Dispose() {
  (*this)->~T();
  initialized_ = false;
}

template <typename T>
void Lazy<T>::Initialize() {
  new (storage_) T();
  initialized_ = true;
}

template <typename T>
template <typename A>
void Lazy<T>::Initialize(A a) {
  new (storage_) T(a);
  initialized_ = true;
}

template <typename T>
template <typename A, typename B>
void Lazy<T>::Initialize(A a, B b) {
  new (storage_) T(a, b);
  initialized_ = true;
}

template <typename T>
template <typename A, typename B, typename C>
void Lazy<T>::Initialize(A a, B b, C c) {
  new (storage_) T(a, b, c);
  initialized_ = true;
}

template <typename T>
T* Lazy<T>::address() {
  return reinterpret_cast<T*>(storage_);
}

template <typename T>
bool Lazy<T>::initialized() const {
  return initialized_;
}

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_UTIL_INL_H_
