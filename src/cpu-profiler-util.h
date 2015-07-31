// Copyright (c) 2015, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

// Extracted from cpu-profiler.h for easier unit testing.
#ifndef AGENT_SRC_CPU_PROFILER_UTIL_H_
#define AGENT_SRC_CPU_PROFILER_UTIL_H_

#include "strong-agent.h"

#include <stddef.h>
#include <stdint.h>

namespace strongloop {
namespace agent {
namespace cpuprofiler {

inline bool ParseJSFunctionName(const char* const name, const size_t size,
                                size_t* const function_name_offset,
                                size_t* const function_name_size,
                                size_t* const script_name_offset,
                                size_t* const script_name_size,
                                uint32_t* const line_number) {
  // Regular JS entries look like "LazyCompile:foo script.js:42".
  // FIXME(bnoordhuis) Doesn't parse "foo symbol(hash DEADBEEF):42" correctly.
  if (size == 0) return false;

  if (size >= sizeof("Script:*") - 1 &&
      Compare(name, "Script:", sizeof("Script:") - 1) == 0) {
    // '*' and '~' indicate the optimization status.
    const size_t offset = sizeof("Script:*") - 1;
    *function_name_offset = offset;
    *function_name_size = 0;
    *script_name_offset = offset;
    *script_name_size = size - offset;
    *line_number = 0;
    return true;
  }

  size_t index = 0;
  if (size > sizeof("LazyCompile:") - 1 &&
      Compare(name, "LazyCompile:", sizeof("LazyCompile:") - 1) == 0) {
    index = sizeof("LazyCompile:") - 1;
    // '*' and '~' indicate the optimization status.
    if (name[index] == '*' || name[index] == '~') index += 1;
  }
  *function_name_offset = index;

  while (index < size && name[index] != ' ') {
    index += 1;
  }

  if (index + 1 >= size) return false;
  *function_name_size = index - *function_name_offset;
  *script_name_offset = index + 1;

  *line_number = 0;
  uint32_t multiplier = 1;
  for (index = size - 1;
       index > *script_name_offset && name[index] >= '0' && name[index] <= '9';
       index -= 1, multiplier *= 10) {
    const uint32_t num = name[index] - '0';
    *line_number += num * multiplier;
  }

  if (name[index] != ':') return false;
  *script_name_size = index - *script_name_offset;

  return true;
}

inline size_t GetFunctionName(const v8::CpuProfileNode* const node,
                              char* const buffer, const size_t size) {
  v8::String::Utf8Value string(node->GetFunctionName());
  return CopyZ(*string, string.length(), buffer, size);
}

inline size_t GetScriptResourceName(const v8::CpuProfileNode* const node,
                                    char* const buffer, const size_t size) {
  v8::String::Utf8Value string(node->GetScriptResourceName());
  return CopyZ(*string, string.length(), buffer, size);
}

inline size_t GetFunctionName(const cpuprofiler::CpuProfileNode* const node,
                              char* const buffer, const size_t size) {
  return node->GetFunctionName(buffer, size);
}
inline size_t GetScriptResourceName(
    const cpuprofiler::CpuProfileNode* const node,
    char* const buffer, const size_t size) {
  return node->GetScriptResourceName(buffer, size);
}

template <typename CpuProfileNode>
v8::Local<v8::Object> ToObject(v8::Isolate* isolate,
                               const CpuProfileNode* node) {
  namespace C = ::compat;

  using v8::Array;
  using v8::Integer;
  using v8::Isolate;
  using v8::Local;
  using v8::Number;
  using v8::Object;
  using v8::String;

  // Use a helper that caches the property strings.
  struct ToObjectHelper {
    std::set<const CpuProfileNode*> visited_;

    explicit ToObjectHelper(Isolate* isolate) : isolate_(isolate) {
      children_sym_ = C::String::NewFromUtf8(isolate, "children");
      function_name_sym_ = C::String::NewFromUtf8(isolate, "functionName");
      line_number_sym_ = C::String::NewFromUtf8(isolate, "lineNumber");
      script_name_sym_ = C::String::NewFromUtf8(isolate, "scriptName");
#if !SL_HAVE_NEW_CPU_PROFILER && !NODE_VERSION_AT_LEAST(0, 11, 0)
      call_uid_sym_ = C::String::NewFromUtf8(isolate, "callUid");
      children_count_sym_ = C::String::NewFromUtf8(isolate, "childrenCount");
      self_samples_count_sym_ =
          C::String::NewFromUtf8(isolate, "selfSamplesCount");
      self_time_sym_ = C::String::NewFromUtf8(isolate, "selfTime");
      total_samples_count_sym_ =
          C::String::NewFromUtf8(isolate, "totalSamplesCount");
      total_time_sym_ = C::String::NewFromUtf8(isolate, "totalTime");
#else  // NODE_VERSION_AT_LEAST(0, 11, 0)
      bailout_reason_sym_ = C::String::NewFromUtf8(isolate, "bailoutReason");
      column_number_sym_ = C::String::NewFromUtf8(isolate, "columnNumber");
      hit_count_sym_ = C::String::NewFromUtf8(isolate, "hitCount");
#endif  // NODE_VERSION_AT_LEAST(0, 11, 0)
    }

    bool IsConstructed() const {
      return children_sym_.IsEmpty() == false &&
             function_name_sym_.IsEmpty() == false &&
             line_number_sym_.IsEmpty() == false &&
             script_name_sym_.IsEmpty() == false &&
#if !SL_HAVE_NEW_CPU_PROFILER && !NODE_VERSION_AT_LEAST(0, 11, 0)
             call_uid_sym_.IsEmpty() == false &&
             children_count_sym_.IsEmpty() == false &&
             self_samples_count_sym_.IsEmpty() == false &&
             self_time_sym_.IsEmpty() == false &&
             total_samples_count_sym_.IsEmpty() == false &&
             total_time_sym_.IsEmpty() == false;
#else  // NODE_VERSION_AT_LEAST(0, 11, 0)
             bailout_reason_sym_.IsEmpty() == false &&
             column_number_sym_.IsEmpty() == false &&
             hit_count_sym_.IsEmpty() == false;
#endif  // NODE_VERSION_AT_LEAST(0, 11, 0)
    }

    Local<Object> ToObject(const CpuProfileNode* node) {
      const int children_count = node->GetChildrenCount();

      // Guard against out-of-memory situations, they're not unlikely when
      // the DAG is big.
      Local<Object> o = C::Object::New(isolate_);
      if (o.IsEmpty()) return Local<Object>();

#if !SL_HAVE_NEW_CPU_PROFILER && !NODE_VERSION_AT_LEAST(0, 11, 0)
      Local<Number> self_samples_count_val =
          C::Number::New(isolate_, node->GetSelfSamplesCount());
      if (self_samples_count_val.IsEmpty()) return Local<Object>();

      Local<Number> self_time_val =
          C::Number::New(isolate_, node->GetSelfTime());
      if (self_time_val.IsEmpty()) return Local<Object>();

      Local<Number> total_samples_count_val =
          C::Number::New(isolate_, node->GetTotalSamplesCount());
      if (total_samples_count_val.IsEmpty()) return Local<Object>();

      Local<Number> total_time_val =
          C::Number::New(isolate_, node->GetTotalTime());
      if (total_time_val.IsEmpty()) return Local<Object>();

      Local<Integer> call_uid_val =
          C::Integer::NewFromUnsigned(isolate_, node->GetCallUid());
      if (call_uid_val.IsEmpty()) return Local<Object>();

      Local<Integer> children_count_val =
          C::Integer::New(isolate_, children_count);
      if (children_count_val.IsEmpty()) return Local<Object>();

      const int line_number = node->GetLineNumber();
      Local<Integer> line_number_val = C::Integer::New(isolate_, line_number);
      if (line_number_val.IsEmpty()) return Local<Object>();

      // Field order compatible with strong-cpu-profiler.
      o->Set(children_count_sym_, children_count_val);
      o->Set(call_uid_sym_, call_uid_val);
      o->Set(self_samples_count_sym_, self_samples_count_val);
      o->Set(total_samples_count_sym_, total_samples_count_val);
      o->Set(self_time_sym_, self_time_val);
      o->Set(total_time_sym_, total_time_val);
      o->Set(line_number_sym_, line_number_val);
      o->Set(script_name_sym_, node->GetScriptResourceName());
      o->Set(function_name_sym_, node->GetFunctionName());
#else  // NODE_VERSION_AT_LEAST(0, 11, 0)
      // Filter out anonymous function names, they are plentiful in most code
      // but uninteresting and we can save quite a bit of bandwidth this way.
      // The string comparison is done in a somewhat roundabout way for
      // performance reasons; writing out the string like this is a little
      // faster than using Equals() or String::AsciiValue.
      {
        static const char anonymous_function[] = "(anonymous function)";
        char buffer[1024];
        const size_t size = GetFunctionName(node, buffer, sizeof(buffer));
        if (size != 0 &&
            size != sizeof(anonymous_function) - 1 &&
            Compare(anonymous_function, buffer, size) != 0) {
          const C::String::NewStringType type = C::String::kNormalString;
          Local<String> function_name_val =
              C::String::NewFromUtf8(isolate_, buffer, type, size);
          if (function_name_val.IsEmpty()) return Local<Object>();
          o->Set(function_name_sym_, function_name_val);
        }
      }

      {
        char buffer[1024];
        const size_t size = GetScriptResourceName(node, buffer, sizeof(buffer));
        const C::String::NewStringType type = C::String::kNormalString;
        Local<String> script_name_val =
            C::String::NewFromUtf8(isolate_, buffer, type, size);
        if (script_name_val.IsEmpty()) return Local<Object>();
        o->Set(script_name_sym_, script_name_val);
      }

      // The hit count is frequently zero, meaning the function was in the
      // call tree on the stack somewhere but not actually sampled by the
      // profiler.  A zero hit count implies that this node is not a leaf
      // node, the actual sample is in one of its descendants.
      const unsigned int hit_count = node->GetHitCount();
      if (hit_count > 0) {
        Local<Integer> hit_count_val =
            C::Integer::NewFromUnsigned(isolate_, hit_count);
        if (hit_count_val.IsEmpty()) return Local<Object>();
        o->Set(hit_count_sym_, hit_count_val);
      }

      // TODO(bnoordhuis) There is only a limited number of bailout reasons.
      // Collect them in a tree-like structure that caches the String handles.
      const char* const bailout_reason = node->GetBailoutReason();
      if (bailout_reason != NULL && bailout_reason[0] != '\0' &&
          ::strcmp(bailout_reason, "no reason") != 0) {
        Local<String> bailout_reason_val =
            C::String::NewFromUtf8(isolate_, bailout_reason);
        if (bailout_reason_val.IsEmpty()) return Local<Object>();
        o->Set(bailout_reason_sym_, bailout_reason_val);
      }

      // Note: Line and column numbers start at 1.  Skip setting the property
      // when there is no line or column number information available for this
      // function, saves bandwidth when sending the profile data over the
      // network.
      const int line_number = node->GetLineNumber();
      if (line_number != CpuProfileNode::kNoLineNumberInfo) {
        Local<Integer> line_number_val = C::Integer::New(isolate_, line_number);
        if (line_number_val.IsEmpty()) return Local<Object>();
        o->Set(line_number_sym_, line_number_val);
      }

      const int column_number = node->GetColumnNumber();
      if (column_number != CpuProfileNode::kNoColumnNumberInfo) {
        Local<Integer> column_number_val =
            C::Integer::New(isolate_, column_number);
        if (column_number_val.IsEmpty()) return Local<Object>();
        o->Set(column_number_sym_, column_number_val);
      }

      // Don't create the "children" property for leaf nodes, saves memory
      // and bandwidth.
      if (children_count == 0) {
        return o;
      }
#endif  // NODE_VERSION_AT_LEAST(0, 11, 0)

      Local<Array> children = C::Array::New(isolate_, children_count);
      if (children.IsEmpty()) return Local<Object>();
      for (int index = 0; index < children_count; ++index) {
        const CpuProfileNode* const child_node = node->GetChild(index);
        if (visited_.insert(child_node).second == false) {
          continue;  // Already visited.
        }
        Local<Object> child = this->ToObject(child_node);
        if (child.IsEmpty()) return Local<Object>();
        children->Set(index, child);
      }
      o->Set(children_sym_, children);
      return o;
    }

    Isolate* const isolate_;
    Local<String> children_sym_;
    Local<String> function_name_sym_;
    Local<String> line_number_sym_;
    Local<String> script_name_sym_;
#if !SL_HAVE_NEW_CPU_PROFILER && !NODE_VERSION_AT_LEAST(0, 11, 0)
    Local<String> children_count_sym_;
    Local<String> call_uid_sym_;
    Local<String> self_samples_count_sym_;
    Local<String> self_time_sym_;
    Local<String> total_samples_count_sym_;
    Local<String> total_time_sym_;
#else  // NODE_VERSION_AT_LEAST(0, 11, 0)
    Local<String> bailout_reason_sym_;
    Local<String> column_number_sym_;
    Local<String> hit_count_sym_;
#endif  // NODE_VERSION_AT_LEAST(0, 11, 0)
  };

  ToObjectHelper helper(isolate);
  if (helper.IsConstructed() == false) {
    return Local<Object>();  // Out of memory.
  }
  return helper.ToObject(node);
}

}  // namespace cpuprofiler
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_CPU_PROFILER_UTIL_H_
