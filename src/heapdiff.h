// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_HEAPDIFF_H_
#define AGENT_SRC_HEAPDIFF_H_

#include "strong-agent.h"
#include <stdint.h>
#include <string.h>

#include <algorithm>
#include <iterator>
#include <map>
#include <set>
#include <vector>

namespace strongloop {
namespace agent {
namespace heapdiff {

namespace C = ::compat;

using v8::Array;
using v8::FunctionTemplate;
using v8::Handle;
using v8::HandleScope;
using v8::HeapGraphEdge;
using v8::HeapGraphNode;
using v8::HeapProfiler;
using v8::HeapSnapshot;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::SnapshotObjectId;
using v8::String;
using v8::Value;

const HeapSnapshot* start_snapshot;

// Wrap heap nodes in a small wrapper class that caches the node identifier.
// v8::HeapGraphNode::GetId() is extraordinary slow because it looks up the
// current isolate in thread-local storage with pthread_getspecific().
// In benchmarks where the id is not cached, about 25% of CPU time is
// attributable to v8::HeapGraphNode::GetId().
class HeapGraphNodeWrap {
 public:
  explicit HeapGraphNodeWrap(const HeapGraphNode* node);
  const HeapGraphNode* node() const;
  SnapshotObjectId id() const;
  bool operator<(const HeapGraphNodeWrap& that) const;

 private:
  const HeapGraphNode* node_;
  SnapshotObjectId id_;
};

class Key {
 public:
  explicit Key(Handle<String> string);
  // Copy constructor has move semantics, afterwards that.data() returns NULL.
  Key(const Key& that);
  ~Key();
  bool operator<(const Key& that) const;
  Handle<String> handle() const;
  const uint16_t* data() const;
  unsigned size() const;
  uint32_t hash() const;

 private:
  // Mirrors StringStorage::kMaxNameSize in $v8/src/profile-generator.h
  static const unsigned kMaxNameSize = 1024;
  Handle<String> handle_;
  mutable uint16_t* data_;
  mutable unsigned size_;
  mutable uint32_t hash_;
  uint16_t buffer_[32];
  void operator=(const Key&);
};

class Score {
 public:
  Score();
  int count() const;
  int size() const;
  void Plus(const HeapGraphNodeWrap& wrapper);
  void Minus(const HeapGraphNodeWrap& wrapper);

 private:
  int count_;
  int size_;
};

typedef std::map<Key, Score> HeapGraphNodeMap;
typedef std::set<HeapGraphNodeWrap> HeapGraphNodeSet;
typedef std::vector<HeapGraphNodeWrap> HeapGraphNodeVector;

// TODO(bnoordhuis) This should be in a util.h header.
uint32_t JenkinsHash(const uint8_t* data, unsigned size);

void AddHeapGraphNodeToSet(const HeapGraphNode* node, HeapGraphNodeSet* set);

// Returns an object that looks something like this:
//
//  [ { type: 'Timeout', total: 1, size: 136 },
//    { type: 'Timer', total: 2, size: 64 },
//    { type: 'Array', total: 1, size: 32 } ] }
//
// |type| is the object class name, |total| the number of instances that were
// created between the two snapshots and |size| is the aggregated self size,
// not the aggregated retained size!  The retained size is much more expensive
// to calculate.
//
// When |total| and |size| are negative, more instances have been reaped by
// the garbage collector than were created by the application.  |total| and
// |size| are always paired: if one is negative, then so is the other.
Local<Object> Summarize(Isolate* isolate, const HeapSnapshot* start_snapshot,
                        const HeapSnapshot* end_snapshot);

HeapGraphNodeWrap::HeapGraphNodeWrap(const HeapGraphNode* node)
    : node_(node), id_(node->GetId()) {}

const HeapGraphNode* HeapGraphNodeWrap::node() const { return node_; }

SnapshotObjectId HeapGraphNodeWrap::id() const { return id_; }

bool HeapGraphNodeWrap::operator<(const HeapGraphNodeWrap& that) const {
  return id() < that.id();
}

Key::Key(Handle<String> handle)
    : handle_(handle), data_(NULL), size_(0), hash_(0) {
  uint16_t* data = buffer_;
  unsigned maxsize = ArraySize(buffer_);
  unsigned size = 0;
  // HINT_MANY_WRITES_EXPECTED flattens cons strings before writing on the
  // assumption that we'll be processing the same cons strings repeatedly.
  // Seems like a reasonable assumption to make because there will normally
  // be many objects with the same class name.  Class names are usually flat
  // strings to start with so it might be a wash but the hint is unlikely to
  // hurt.
  const int options =
      String::HINT_MANY_WRITES_EXPECTED | String::NO_NULL_TERMINATION;
  for (;;) {
    // The choice for String::Write() is intentional.  String::WriteAscii() and
    // particularly String::WriteUtf8() are tremendously slow in comparison.
    size += handle->Write(data + size, size, maxsize - size, options);
    if (size < maxsize) {
      break;
    }
    if (maxsize >= kMaxNameSize) {
      break;
    }
    unsigned const new_maxsize = 2 * maxsize;
    uint16_t* const new_data = new uint16_t[new_maxsize];
    Copy(new_data, data, maxsize);
    if (data != buffer_) {
      delete[] data;
    }
    data = new_data;
    maxsize = new_maxsize;
  }
  data_ = data;
  size_ = size;
  hash_ = JenkinsHash(reinterpret_cast<const uint8_t*>(data), size);
}

Key::~Key() {
  if (data_ != buffer_) {
    delete[] data_;
  }
}

Key::Key(const Key& that)
    : handle_(that.handle_),
      data_(that.data_),
      size_(that.size_),
      hash_(that.hash_) {
  if (that.data_ == that.buffer_) {
    data_ = Copy(buffer_, that.buffer_, that.size_);
  }
  that.data_ = NULL;
  that.size_ = 0;
  that.hash_ = 0;
}

bool Key::operator<(const Key& that) const {
  if (hash() < that.hash()) {
    return true;
  }
  if (hash() > that.hash()) {
    return false;
  }
  if (size() < that.size()) {
    return true;
  }
  if (size() > that.size()) {
    return false;
  }
  return Compare(data(), that.data(), size()) < 0;
}

Handle<String> Key::handle() const { return handle_; }

const uint16_t* Key::data() const { return data_; }

unsigned Key::size() const { return size_; }

uint32_t Key::hash() const { return hash_; }

Score::Score() : count_(0), size_(0) {}

int Score::count() const { return count_; }

int Score::size() const { return size_; }

void Score::Plus(const HeapGraphNodeWrap& wrap) {
  const HeapGraphNode* node = wrap.node();
  count_ += 1, size_ += node->GetSelfSize();
}

void Score::Minus(const HeapGraphNodeWrap& wrap) {
  const HeapGraphNode* node = wrap.node();
  count_ -= 1, size_ -= node->GetSelfSize();
}

uint32_t JenkinsHash(const uint8_t* data, unsigned size) {
  uint32_t hash = 0;
  for (unsigned index = 0; index < size; index += 1) {
    hash += data[index];
    hash += hash << 10;
    hash ^= hash >> 6;
  }
  hash += hash << 3;
  hash ^= hash >> 11;
  hash += hash << 15;
  return hash;
}

void AddHeapGraphNodeToSet(const HeapGraphNode* node, HeapGraphNodeSet* set) {
  // Heap numbers are numbers that don't fit in a SMI (a tagged pointer),
  // either because they're fractional or too large.  I'm not 100% sure
  // it's okay to filter them out because excessive heap number allocation
  // is a somewhat frequent source of performance issues.  On the other hand,
  // we're serializing the heap snapshot and sending it over the wire.
  // Including heap numbers would balloon the size of the payload.
  // Maybe we should simply keep track of the _number_ of heap numbers.
  if (node->GetType() == HeapGraphNode::kHeapNumber) {
    return;
  }
  if (set->insert(HeapGraphNodeWrap(node)).second == false) {
    // Already in set.  We've processed this node before so there's no need
    // to iterate over its children.
    return;
  }
  const int children_count = node->GetChildrenCount();
  for (int index = 0; index < children_count; index += 1) {
    const HeapGraphEdge* edge = node->GetChild(index);
    const HeapGraphEdge::Type type = edge->GetType();
    // Filter out uninteresting edge types.
    //
    //  - Internal links are cons strings slices, relocation data, etc.
    //  - Shortcuts are predominantly the glue objects for functions bound
    //    with Function#bind().
    //  - Weak references (almost?) always point to internal oddbals that
    //    cannot be inspected.
    //
    // Hidden links need to be followed with V8 3.14; they are usually
    // backlinks for retained size calculations but they also interact
    // with eval().  It's safe to skip them with V8 3.26 and newer.
    //
    // Vice versa, internal links should be safe to skip with 3.14 but
    // not with 3.26 because they interact with object allocations.
    if (type == HeapGraphEdge::kShortcut) continue;
    if (type == HeapGraphEdge::kWeak) continue;
#if !NODE_VERSION_AT_LEAST(0, 11, 0)
    if (type == HeapGraphEdge::kInternal) continue;  // V8 3.14
#else
    if (type == HeapGraphEdge::kHidden) continue; // V8 3.26
#endif
    AddHeapGraphNodeToSet(edge->GetToNode(), set);
  }
}

template <void (Score::*Method)(const HeapGraphNodeWrap&)>
struct SummarizeHelper : public std::iterator<std::output_iterator_tag, Score> {
  explicit SummarizeHelper(HeapGraphNodeMap* map) : map_(map) {}
  SummarizeHelper& operator++() { return *this; }
  SummarizeHelper& operator++(int) { return *this; }
  SummarizeHelper& operator*() { return *this; }
  void operator=(const HeapGraphNodeWrap& wrap) {
    const HeapGraphNode* node = wrap.node();
    if (node->GetType() != HeapGraphNode::kObject) {
      return;
    }
    Key key(node->GetName());
    if (key.data() == NULL) {
      return;  // Bailed out because string is too big.
    }
    Score& score = (*map_)[key];
    (score.*Method)(wrap);
  }
  HeapGraphNodeMap* map_;
};

Local<Object> Summarize(Isolate* isolate, const HeapSnapshot* start_snapshot,
                        const HeapSnapshot* end_snapshot) {
  HeapGraphNodeSet start_objects;
  HeapGraphNodeSet end_objects;
  AddHeapGraphNodeToSet(start_snapshot->GetRoot(), &start_objects);
  AddHeapGraphNodeToSet(end_snapshot->GetRoot(), &end_objects);

  HeapGraphNodeMap summary;
  std::set_difference(end_objects.begin(), end_objects.end(),
                      start_objects.begin(), start_objects.end(),
                      SummarizeHelper<&Score::Plus>(&summary));
  std::set_difference(start_objects.begin(), start_objects.end(),
                      end_objects.begin(), end_objects.end(),
                      SummarizeHelper<&Score::Minus>(&summary));

  Local<String> type_string = C::String::NewFromUtf8(isolate, "type");
  Local<String> total_string = C::String::NewFromUtf8(isolate, "total");
  Local<String> size_string = C::String::NewFromUtf8(isolate, "size");

  uint32_t index = 0;
  Local<Array> result = C::Array::New(isolate);
  for (HeapGraphNodeMap::const_iterator it = summary.begin(),
                                        end = summary.end();
       it != end; ++it) {
    const Key& key = it->first;
    const Score& score = it->second;
    Local<Object> object = C::Object::New(isolate);
    object->Set(total_string, C::Integer::New(isolate, score.count()));
    object->Set(size_string, C::Integer::New(isolate, score.size()));
    object->Set(type_string, key.handle());
    result->Set(index, object);
    index += 1;
  }

  return result;
}

C::ReturnType StartHeapDiff(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);
  if (start_snapshot == NULL) {
    start_snapshot = C::HeapProfiler::TakeHeapSnapshot(isolate);
  }
  return handle_scope.Return();
}

C::ReturnType StopHeapDiff(const C::ArgumentType& args) {
  Isolate* isolate = args.GetIsolate();
  C::ReturnableHandleScope handle_scope(args);

  Local<Value> result = C::Undefined(isolate);
  if (start_snapshot == NULL) {
    return handle_scope.Return(result);
  }

  if (args[0]->IsTrue()) {
    const HeapSnapshot* end_snapshot =
        C::HeapProfiler::TakeHeapSnapshot(isolate);
    result = Summarize(isolate, start_snapshot, end_snapshot);
  }

  start_snapshot = NULL;
  C::HeapProfiler::DeleteAllHeapSnapshots(isolate);

  return handle_scope.Return(result);
}

void Initialize(Isolate* isolate, Local<Object> binding) {
  binding->Set(C::String::NewFromUtf8(isolate, "startHeapDiff"),
               C::FunctionTemplate::New(isolate, StartHeapDiff)->GetFunction());
  binding->Set(C::String::NewFromUtf8(isolate, "stopHeapDiff"),
               C::FunctionTemplate::New(isolate, StopHeapDiff)->GetFunction());
}
}  // namespace heapdiff
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_HEAPDIFF_H_
