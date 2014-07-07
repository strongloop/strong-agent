// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_PROFILER_H_
#define AGENT_SRC_PROFILER_H_

#include "strong-agent.h"
#include <sstream>
#include <string>

namespace strongloop {
namespace agent {
namespace profiler {

namespace C = compat;

using v8::Array;
using v8::CpuProfile;
using v8::CpuProfileNode;
using v8::CpuProfiler;
using v8::FunctionTemplate;
using v8::Handle;
using v8::HandleScope;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Number;
using v8::Object;
using v8::String;
using v8::Value;

Local<Object> ToObject(Isolate* isolate, const CpuProfileNode* node) {
  // Use a helper that caches the property strings.
  struct ToObjectHelper {
    explicit ToObjectHelper(Isolate* isolate) : isolate_(isolate) {
      children_sym_ = C::String::NewFromUtf8(isolate, "children");
      function_name_sym_ = C::String::NewFromUtf8(isolate, "functionName");
      line_number_sym_ = C::String::NewFromUtf8(isolate, "lineNumber");
      script_name_sym_ = C::String::NewFromUtf8(isolate, "scriptName");
#if SL_NODE_VERSION == 10
      call_uid_sym_ = C::String::NewFromUtf8(isolate, "callUid");
      children_count_sym_ = C::String::NewFromUtf8(isolate, "childrenCount");
      self_samples_count_sym_ =
          C::String::NewFromUtf8(isolate, "selfSamplesCount");
      self_time_sym_ = C::String::NewFromUtf8(isolate, "selfTime");
      total_samples_count_sym_ =
          C::String::NewFromUtf8(isolate, "totalSamplesCount");
      total_time_sym_ = C::String::NewFromUtf8(isolate, "totalTime");
#elif SL_NODE_VERSION == 12
      bailout_reason_sym_ = C::String::NewFromUtf8(isolate, "bailoutReason");
      column_number_sym_ = C::String::NewFromUtf8(isolate, "columnNumber");
      hit_count_sym_ = C::String::NewFromUtf8(isolate, "hitCount");
#endif
    }

    bool IsConstructed() const {
      return children_sym_.IsEmpty() == false &&
             function_name_sym_.IsEmpty() == false &&
             line_number_sym_.IsEmpty() == false &&
             script_name_sym_.IsEmpty() == false &&
#if SL_NODE_VERSION == 10
             call_uid_sym_.IsEmpty() == false &&
             children_count_sym_.IsEmpty() == false &&
             self_samples_count_sym_.IsEmpty() == false &&
             self_time_sym_.IsEmpty() == false &&
             total_samples_count_sym_.IsEmpty() == false &&
             total_time_sym_.IsEmpty() == false;
#elif SL_NODE_VERSION == 12
             bailout_reason_sym_.IsEmpty() == false &&
             column_number_sym_.IsEmpty() == false &&
             hit_count_sym_.IsEmpty() == false;
#endif
    }

    Local<Object> ToObject(const CpuProfileNode* node) const {
      const int children_count = node->GetChildrenCount();

      // Guard against out-of-memory situations, they're not unlikely when
      // the DAG is big.
      Local<Object> o = C::Object::New(isolate_);
      if (o.IsEmpty()) return Local<Object>();

      // The next two cannot really fail but the extra checks don't hurt.
      Handle<String> script_name_val = node->GetScriptResourceName();
      if (script_name_val.IsEmpty()) return Local<Object>();

      Handle<String> function_name_val = node->GetFunctionName();
      if (function_name_val.IsEmpty()) return Local<Object>();

#if SL_NODE_VERSION == 10
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
      o->Set(script_name_sym_, script_name_val);
      o->Set(function_name_sym_, function_name_val);
#elif SL_NODE_VERSION == 12
      o->Set(script_name_sym_, script_name_val);
      o->Set(function_name_sym_, function_name_val);

      // Filter out anonymous function names, they are plentiful in most code
      // but uninteresting and we can save quite a bit of bandwidth this way.
      // The string comparison is done in a somewhat roundabout way for
      // performance reasons; writing out the string like this is a little
      // faster than using Equals() or String::AsciiValue.
      static const uint8_t anonymous_function[] = "(anonymous function)";
      uint8_t write_buffer[sizeof(anonymous_function) - 1] = { 0 };
      const bool check = function_name_val->Length() == sizeof(write_buffer);
      if (check) {
        function_name_val->WriteOneByte(write_buffer,
                                        0,
                                        sizeof(write_buffer),
                                        String::NO_NULL_TERMINATION);
      }
      if (check == false || Compare(anonymous_function,
                                    write_buffer,
                                    sizeof(write_buffer)) != 0) {
        o->Set(function_name_sym_, function_name_val);
      }

      // The hit count is frequently zero, meaning the function was in the
      // call tree on the stack somewhere but not actually sampled by the
      // profiler.  A zero hit count implies that this node is not a leaf
      // node, the actual sample is in one of its descendants.
      const unsigned int hit_count = node->GetHitCount();
      if (hit_count > 0) {
        Local<Integer> hit_count_val =
            Integer::NewFromUnsigned(isolate_, hit_count);
        if (hit_count_val.IsEmpty()) return Local<Object>();
        o->Set(hit_count_sym_, hit_count_val);
      }

      // TODO(bnoordhuis) There is only a limited number of bailout reasons.
      // Collect them in a tree-like structure that caches the String handles.
      const char* const bailout_reason = node->GetBailoutReason();
      if (bailout_reason != NULL &&
          bailout_reason[0] != '\0' &&
          ::strcmp(bailout_reason, "no reason") != 0) {
        const uint8_t* const bytes =
            reinterpret_cast<const uint8_t*>(bailout_reason);
        Local<String> bailout_reason_val =
            String::NewFromOneByte(isolate_, bytes);
        if (bailout_reason_val.IsEmpty()) return Local<Object>();
        o->Set(bailout_reason_sym_, bailout_reason_val);
      }

      // Note: Line and column numbers start at 1.  Skip setting the property
      // when there is no line or column number information available for this
      // function, saves bandwidth when sending the profile data over the
      // network.
      const int line_number = node->GetLineNumber();
      if (line_number != CpuProfileNode::kNoLineNumberInfo) {
        Local<Integer> line_number_val = Integer::New(isolate_, line_number);
        if (line_number_val.IsEmpty()) return Local<Object>();
        o->Set(line_number_sym_, line_number_val);
      }

      const int column_number = node->GetColumnNumber();
      if (column_number != CpuProfileNode::kNoColumnNumberInfo) {
        Local<Integer> column_number_val =
            Integer::New(isolate_, column_number);
        if (column_number_val.IsEmpty()) return Local<Object>();
        o->Set(column_number_sym_, column_number_val);
      }

      // Don't create the "children" property for leaf nodes, saves memory
      // and bandwidth.
      if (children_count == 0) {
        return o;
      }
#endif

      Local<Array> children = C::Array::New(isolate_, children_count);
      if (children.IsEmpty()) return Local<Object>();
      for (int index = 0; index < children_count; ++index) {
        Local<Object> child = this->ToObject(node->GetChild(index));
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
#if SL_NODE_VERSION == 10
    Local<String> children_count_sym_;
    Local<String> call_uid_sym_;
    Local<String> self_samples_count_sym_;
    Local<String> self_time_sym_;
    Local<String> total_samples_count_sym_;
    Local<String> total_time_sym_;
#elif SL_NODE_VERSION == 12
    Local<String> bailout_reason_sym_;
    Local<String> column_number_sym_;
    Local<String> hit_count_sym_;
#endif
  };

  ToObjectHelper helper(isolate);
  if (helper.IsConstructed() == false) {
    return Local<Object>();  // Out of memory.
  }
  return helper.ToObject(node);
}

const CpuProfile* StopProfiling(Isolate* isolate, Local<String> title) {
#if SL_NODE_VERSION == 10
  Use(isolate);
  return CpuProfiler::StopProfiling(title);
#elif SL_NODE_VERSION == 12
  return isolate->GetCpuProfiler()->StopCpuProfiling(title);
#endif
}

#if SL_NODE_VERSION == 12
// FIXME(bnoordhuis) Mangles UTF-8 sequences, it treats them as bytes.
std::string EscapeJson(const char* string, size_t size, size_t start = 0) {
  std::string head(string, start);
  std::stringstream stream(head);
  for (size_t index = start; index < size; index += 1) {
    const uint8_t c = static_cast<uint8_t>(string[index]);
    if (c == '"') {
      stream << "\\\"";
    } else if (c < 0x20 || c > 0x7F) {
      // Easier to calculate the hex digits than set and restore std::ios::hex.
      static const char hex[] = "0123456789abcdef";
      stream << "\\u00" << hex[c >> 4] << hex[c & 15];
    } else {
      stream << c;
    }
  }
  return stream.str();
}

std::string MaybeEscapeJson(const char* string, size_t size) {
  // Scan the string first.  The vast majority won't need escaping
  // and this way we avoid an unnecessary copy into a std::string.
  for (size_t index = 0; index < size; index += 1) {
    const uint8_t c = static_cast<uint8_t>(string[index]);
    if (c < 0x20 || c > 0x7F || c == '"') {
      return EscapeJson(string, size, index);
    }
  }
  return std::string();
}

std::ostream& operator<<(std::ostream& os, Handle<String> string) {
  String::Utf8Value raw_string(string);
  std::string escaped_string(MaybeEscapeJson(*raw_string, raw_string.length()));
  if (escaped_string.empty() == false) {
    os << escaped_string;
  } else {
    os << *raw_string;
  }
  return os;
}

// Produces a stringified JSON object that is consumable by Chrome 35's
// Dev Tools.  Note that when stored as a file, the filename needs to
// have ".cpuprofile" as its extension in order for Chrome to load it.
//
// Support is currently restricted to node.js v0.11 and v0.12.  The version
// of V8 in node.js v0.10 is so old that we can't synthesize output that is
// acceptable to versions of Chrome > 24.  Chrome 24 is so old that it isn't
// available for download anymore so there is no point in supporting it.
void SerializeCpuProfileNode(const CpuProfileNode* node, std::ostream* sink) {
  (*sink) << "{\"functionName\":\"" << node->GetFunctionName();
  // Script id is numerical but for some reason Chrome encodes it as a string
  // so we do too.
  (*sink) << "\",\"scriptId\":\"" << node->GetScriptId();
  (*sink) << "\",\"url\":\"" << node->GetScriptResourceName();
  (*sink) << "\",\"lineNumber\":" << node->GetLineNumber();
  (*sink) << ",\"columnNumber\":" << node->GetColumnNumber();
  (*sink) << ",\"hitCount\":" << node->GetHitCount();
  (*sink) << ",\"callUID\":" << node->GetCallUid();
  (*sink) << ",\"children\":[";
  const int children_count = node->GetChildrenCount();
  if (children_count > 0) {
    SerializeCpuProfileNode(node->GetChild(0), sink);
  }
  for (int index = 1; index < children_count; index += 1) {
    (*sink) << ',';
    SerializeCpuProfileNode(node->GetChild(index), sink);
  }
  const char* bailout_reason = node->GetBailoutReason();
  if (bailout_reason == NULL) {  // GetBailoutReason() currently never returns
    bailout_reason = "";         // a NULL pointer but better safe than sorry.
  }
  (*sink) << "],\"deoptReason\":\"" << bailout_reason;
  (*sink) << "\",\"id\":" << node->GetNodeId();
  (*sink) << '}';
}

void SerializeCpuProfile(const CpuProfile* profile, std::ostream* sink) {
  (*sink) << "{\"head\":";
  SerializeCpuProfileNode(profile->GetTopDownRoot(), sink);
  (*sink) << ",\"startTime\":";
  (*sink) << profile->GetStartTime() / 1e6;
  (*sink) << ",\"endTime\":";
  (*sink) << profile->GetEndTime() / 1e6;
  (*sink) << ",\"samples\":[";
  const int samples_count = profile->GetSamplesCount();
  if (samples_count > 0) {
    (*sink) << profile->GetSample(0)->GetNodeId();
  }
  for (int index = 1; index < samples_count; index += 1) {
    (*sink) << ',' << profile->GetSample(index)->GetNodeId();
  }
  (*sink) << "]}";
}

C::ReturnType StopCpuProfilingAndSerialize(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  const CpuProfile* profile = StopProfiling(isolate, String::Empty(isolate));
  if (profile == NULL) {
    // Not started or preempted by another profiler.
    return handle_scope.Return();
  }
  std::string string;
  {
    std::stringstream string_stream(std::ios::out);
    string_stream.setf(std::ios::fixed);
    string_stream.precision(5);
    SerializeCpuProfile(profile, &string_stream);
    // See https://code.google.com/p/v8/issues/detail?id=3213.
    const_cast<CpuProfile*>(profile)->Delete();
    string = string_stream.str();
  }
  Local<String> result = C::String::NewFromUtf8(isolate,
                                                string.c_str(),
                                                C::String::kNormalString,
                                                string.size());
  return handle_scope.Return(result);
}
#endif

C::ReturnType StartCpuProfiling(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  Local<String> title = String::Empty(isolate);
#if SL_NODE_VERSION == 10
  CpuProfiler::StartProfiling(title);
#elif SL_NODE_VERSION == 12
  const bool record_samples = true;
  isolate->GetCpuProfiler()->StartProfiling(title, record_samples);
#endif
  return handle_scope.Return();
}

C::ReturnType StopCpuProfiling(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  const CpuProfile* profile = StopProfiling(isolate, String::Empty(isolate));
  if (profile == NULL) {
    // Not started or preempted by another profiler.
    return handle_scope.Return();
  }
  Local<Object> top_root = ToObject(isolate, profile->GetTopDownRoot());
  // See https://code.google.com/p/v8/issues/detail?id=3213.
  const_cast<CpuProfile*>(profile)->Delete();
  if (top_root.IsEmpty() == true) {
    return handle_scope.Return();  // Out of memory.
  }
  return handle_scope.Return(top_root);
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  binding->Set(
      C::String::NewFromUtf8(isolate, "startCpuProfiling"),
      C::FunctionTemplate::New(isolate, StartCpuProfiling)->GetFunction());
  binding->Set(
      C::String::NewFromUtf8(isolate, "stopCpuProfiling"),
      C::FunctionTemplate::New(isolate, StopCpuProfiling)->GetFunction());
#if SL_NODE_VERSION == 12
  binding->Set(
      C::String::NewFromUtf8(isolate, "stopCpuProfilingAndSerialize"),
      C::FunctionTemplate::New(isolate,
                               StopCpuProfilingAndSerialize)->GetFunction());
#endif
}

}  // namespace profiler
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_PROFILER_H_
