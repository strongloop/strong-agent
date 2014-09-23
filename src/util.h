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

#define STRINGIFY_HELPER(s) #s

#define STRINGIFY(s) STRINGIFY_HELPER(s)

#define ASSERT(expression)              \
  strongloop::agent::Assert(expression, \
                            __FILE__ ":" STRINGIFY(__LINE__) ": " #expression)

#define ASSERT_EQ(a, b) ASSERT((a) == (b))
#define ASSERT_GE(a, b) ASSERT((a) >= (b))
#define ASSERT_GT(a, b) ASSERT((a) > (b))
#define ASSERT_LE(a, b) ASSERT((a) <= (b))
#define ASSERT_LT(a, b) ASSERT((a) < (b))
#define ASSERT_NE(a, b) ASSERT((a) != (b))

#define CHECK(expression)              \
  strongloop::agent::Check(expression, \
                           __FILE__ ":" STRINGIFY(__LINE__) ": " #expression)

#define CHECK_EQ(a, b) CHECK((a) == (b))
#define CHECK_GE(a, b) CHECK((a) >= (b))
#define CHECK_GT(a, b) CHECK((a) > (b))
#define CHECK_LE(a, b) CHECK((a) <= (b))
#define CHECK_LT(a, b) CHECK((a) < (b))
#define CHECK_NE(a, b) CHECK((a) != (b))

template <typename T>
void Assert(const T& result, const char* expression);

template <typename T, size_t N>
size_t ArraySize(const T(&a)[N]);

template <typename T>
void Check(const T& result, const char* expression);

template <typename T>
int Compare(const T* a, const T* b, size_t size);

template <typename T>
T* Copy(T* to, const T* from, size_t size);

// For squelching warnings about unused parameters/variables.
template <typename T>
void Use(const T&);

template <typename T>
class Lazy {
 public:
  inline Lazy();
  inline ~Lazy();
  inline void Dispose();
  inline void Initialize();
  template <typename A>
  inline void Initialize(A);
  template <typename A, typename B>
  inline void Initialize(A, B);
  template <typename A, typename B, typename C>
  inline void Initialize(A, B, C);
  inline T* operator->();
  inline T& operator*();
  inline T* address();
  inline bool initialized() const;

 private:
  bool initialized_;
  char storage_[sizeof(T)];
};

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_UTIL_H_
