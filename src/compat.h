// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_COMPAT_H_
#define AGENT_SRC_COMPAT_H_

#include "v8.h"

namespace strongloop {
namespace agent {
namespace compat {

#if SL_NODE_VERSION == 10
typedef v8::Arguments ArgumentType;
typedef v8::Handle<v8::Value> ReturnType;
typedef v8::InvocationCallback FunctionCallback;
#elif SL_NODE_VERSION == 12
typedef v8::FunctionCallbackInfo<v8::Value> ArgumentType;
typedef void ReturnType;
typedef v8::FunctionCallback FunctionCallback;
#endif

v8::Local<v8::Boolean> True(v8::Isolate* isolate);
v8::Local<v8::Boolean> False(v8::Isolate* isolate);
v8::Local<v8::Primitive> Null(v8::Isolate* isolate);
v8::Local<v8::Primitive> Undefined(v8::Isolate* isolate);

class AllStatic {
 private:
  AllStatic();
};

struct Array : public AllStatic {
  inline static v8::Local<v8::Array> New(v8::Isolate* isolate, int length = 0);
};

struct FunctionTemplate : public AllStatic {
  inline static v8::Local<v8::FunctionTemplate>
      New(v8::Isolate* isolate, FunctionCallback callback = 0);
};

struct Integer : public AllStatic {
  inline static v8::Local<v8::Integer> New(v8::Isolate* isolate, int32_t value);
  inline static v8::Local<v8::Integer> NewFromUnsigned(v8::Isolate* isolate,
                                                       uint32_t value);
};

struct Number : public AllStatic {
  inline static v8::Local<v8::Number> New(v8::Isolate* isolate, double value);
};

struct Object : public AllStatic {
  inline static v8::Local<v8::Object> New(v8::Isolate* isolate);
};

struct String : public AllStatic {
  enum NewStringType {
    kNormalString, kInternalizedString, kUndetectableString
  };
  inline static v8::Local<v8::String> NewFromUtf8(
      v8::Isolate* isolate,
      const char* data,
      NewStringType type = kNormalString,
      int length = -1);
};

class HandleScope {
 public:
  inline explicit HandleScope(v8::Isolate* isolate);
 private:
  v8::HandleScope handle_scope_;
};

template <typename T>
class Persistent {
 public:
  inline ~Persistent();
  inline v8::Local<T> ToLocal(v8::Isolate* isolate) const;
  inline void Reset();
  inline void Reset(v8::Isolate* isolate, v8::Local<T> value);
  inline bool IsEmpty() const;
 private:
  v8::Persistent<T> handle_;
};

class ReturnableHandleScope {
 public:
  inline explicit ReturnableHandleScope(const ArgumentType& args);
  inline ReturnType Return();
  inline ReturnType Return(intptr_t value);
  inline ReturnType Return(double value);
  inline ReturnType Return(const char* value);
  inline ReturnType Return(v8::Local<v8::Value> value);
 private:
  inline v8::Isolate* isolate() const;
  const ArgumentType& args_;
  v8::HandleScope handle_scope_;
};

}  // namespace compat
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_COMPAT_H_
