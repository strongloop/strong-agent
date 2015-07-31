// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_PROFILER_H_
#define AGENT_SRC_PROFILER_H_

#include "strong-agent.h"
#include "cpu-profiler-util.h"

#include <sstream>
#include <string>

namespace strongloop {
namespace agent {
namespace profiler {

namespace C = ::compat;

using v8::Handle;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;

// FIXME(bnoordhuis) Mangles UTF-8 sequences, it treats them as bytes.
std::string EscapeJson(const char* string, size_t size, size_t start = 0) {
  std::string head(string, start);
  std::stringstream stream(head);
  for (size_t index = start; index < size; index += 1) {
    const uint8_t c = static_cast<uint8_t>(string[index]);
    if (c == '"') {
      stream << "\\\"";
    } else if (c == '\\') {
      stream << "\\\\";
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
    if (c < 0x20 || c > 0x7F || c == '"' || c == '\\') {
      return EscapeJson(string, size, index);
    }
  }
  return std::string();
}

// Produces a stringified JSON object that is consumable by Chrome 35's
// Dev Tools.  Note that when stored as a file, the filename needs to
// have ".cpuprofile" as its extension in order for Chrome to load it.
#if !SL_HAVE_NEW_CPU_PROFILER && !NODE_VERSION_AT_LEAST(0, 11, 0)
inline std::ostream& operator<<(std::ostream& os, Handle<String> string) {
  String::Utf8Value raw_string(string);
  std::string escaped_string(MaybeEscapeJson(*raw_string, raw_string.length()));
  if (escaped_string.empty() == false) {
    os << escaped_string;
  } else {
    os << *raw_string;
  }
  return os;
}

void SerializeCpuProfileNode(const CpuProfileNode* node, std::ostream* sink) {
  (*sink) << "{\"functionName\":\"" << node->GetFunctionName();
  // Script id is numerical but for some reason Chrome encodes it as a string
  // so we do too.
  // FIXME(bnoordhuis) V8 3.14 does not have CpuProfileNode::GetScriptId().
  // We could manually map script names to IDs but DevTools does not seem
  // to actually use the script ID.  Let's not worry about it for now.
  (*sink) << "\",\"scriptId\":\"" << 42;
  (*sink) << "\",\"url\":\"" << node->GetScriptResourceName();
  (*sink) << "\",\"lineNumber\":" << node->GetLineNumber();
  (*sink) << ",\"columnNumber\":" << v8::Message::kNoColumnInfo;
  (*sink) << ",\"hitCount\":" << int64_t(node->GetSelfSamplesCount());
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
  const char* bailout_reason = "";
  (*sink) << "],\"deoptReason\":\"" << bailout_reason;
  // Use the address as an ersatz node ID, it's stable over the lifetime of
  // the snapshot.
  const int kShiftBits = sizeof(void*) == 8 ? 3 : 2;
  const uintptr_t id = reinterpret_cast<uintptr_t>(node) >> kShiftBits;
  (*sink) << "\",\"id\":" << id;
  (*sink) << '}';
}

void SerializeCpuProfile(const CpuProfile* profile, std::ostream* sink) {
  (*sink) << "{\"head\":";
  const CpuProfileNode* root = profile->GetTopDownRoot();
  SerializeCpuProfileNode(root, sink);
  (*sink) << ",\"startTime\":" << 0;
  (*sink) << ",\"endTime\":" << int64_t(root->GetTotalTime() / 1e3);
  (*sink) << ",\"samples\":[]}";
}
#else   // NODE_VERSION_AT_LEAST(0, 11, 0)
void SerializeCpuProfileNode(const CpuProfileNode* node, std::ostream* sink,
                             std::set<const CpuProfileNode*>* visited) {
  struct Helper {
    typedef size_t (*Callback)(const CpuProfileNode*, char*, size_t);
    inline static void Serialize(const CpuProfileNode* const node,
                                 const Callback callback,
                                 std::ostream* const sink) {
      char buffer[1024];
      const size_t size = callback(node, buffer, sizeof(buffer));
      const std::string escaped_string = MaybeEscapeJson(buffer, size);
      if (escaped_string.empty()) {
        sink->write(buffer, size);
      } else {
        (*sink) << escaped_string;
      }
    }
  };
  (*sink) << "{\"functionName\":\"";
  Helper::Serialize(node, &cpuprofiler::GetFunctionName, sink);
  // Script id is numerical but for some reason Chrome encodes it as a string
  // so we do too.
  (*sink) << "\",\"scriptId\":\"" << node->GetScriptId();
  (*sink) << "\",\"url\":\"";
  Helper::Serialize(node, &cpuprofiler::GetScriptResourceName, sink);
  (*sink) << "\",\"lineNumber\":" << node->GetLineNumber();
  (*sink) << ",\"columnNumber\":" << node->GetColumnNumber();
  (*sink) << ",\"hitCount\":" << node->GetHitCount();
  (*sink) << ",\"callUID\":" << node->GetCallUid();
  (*sink) << ",\"children\":[";
  bool first_element = true;
  const int children_count = node->GetChildrenCount();
  for (int index = 0; index < children_count; index += 1) {
    const CpuProfileNode* const child = node->GetChild(index);
    if (visited->insert(child).second == false) {
      continue;  // Already visited.
    }
    if (first_element) {
      first_element = false;
    } else {
      (*sink) << ',';
    }
    SerializeCpuProfileNode(node->GetChild(index), sink, visited);
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
  {
    std::set<const CpuProfileNode*> visited;
    SerializeCpuProfileNode(profile->GetTopDownRoot(), sink, &visited);
  }
  (*sink) << ",\"startTime\":" << int64_t(profile->GetStartTime() / 1e6);
  (*sink) << ",\"endTime\":" << int64_t(profile->GetEndTime() / 1e6);
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
#endif  // NODE_VERSION_AT_LEAST(0, 11, 0)

C::ReturnType StopCpuProfilingAndSerialize(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  const CpuProfile* profile = cpuprofiler::StopCpuProfiling(isolate);
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
  Local<String> result = C::String::NewFromUtf8(
      isolate, string.c_str(), C::String::kNormalString, string.size());
  return handle_scope.Return(result);
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  binding->Set(C::String::NewFromUtf8(isolate, "stopCpuProfilingAndSerialize"),
               C::FunctionTemplate::New(isolate, StopCpuProfilingAndSerialize)
                   ->GetFunction());
}

}  // namespace profiler
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_PROFILER_H_
