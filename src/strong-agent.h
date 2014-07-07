// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_STRONG_AGENT_H_
#define AGENT_SRC_STRONG_AGENT_H_

// Can't use `#pragma GCC diagnostic push/pop`, not supported by gcc 4.2.
#if defined(__GNUC__)
# pragma GCC diagnostic ignored "-Wunused-parameter"
# if __GNUC__ > 4 || __GNUC__ == 4 && __GNUC_MINOR__ >= 8
#  pragma GCC diagnostic ignored "-Wunused-local-typedefs"
# endif
#endif

#include "node_version.h"
#include "node.h"
#include "uv.h"
#include "v8.h"
#include "v8-profiler.h"

#if defined(__GNUC__)
# if __GNUC__ > 4 || __GNUC__ == 4 && __GNUC_MINOR__ >= 8
#  pragma GCC diagnostic warning "-Wunused-local-typedefs"
# endif
# pragma GCC diagnostic warning "-Wunused-parameter"
#endif

#if defined(__APPLE__)
# define SL_PLATFORM_DARWIN 1
#else
# define SL_PLATFORM_DARWIN 0
#endif

#if defined(__FreeBSD__)
# define SL_PLATFORM_FREEBSD 1
#else
# define SL_PLATFORM_FREEBSD 0
#endif

#if defined(__linux__)
# define SL_PLATFORM_LINUX 1
#else
# define SL_PLATFORM_LINUX 0
#endif

#if defined(_WIN32)
# define SL_PLATFORM_WINDOWS 1
#else
# define SL_PLATFORM_WINDOWS 0
#endif

#if defined(__sun)
# define SL_PLATFORM_SOLARIS 1
#else
# define SL_PLATFORM_SOLARIS 0
#endif

#if SL_PLATFORM_WINDOWS
# define SL_PLATFORM_POSIX 0
#else
# define SL_PLATFORM_POSIX 1
#endif

#if SL_PLATFORM_POSIX
# include "platform-posix.h"
#endif

#if SL_PLATFORM_WINDOWS
# include "platform-win32.h"
#endif

// Assumption: the release after v0.12 will be v1.0, as prophesied.
#if NODE_MAJOR_VERSION == 0 && NODE_MINOR_VERSION >= 11
# define SL_NODE_VERSION 12  // v0.12
#elif NODE_MAJOR_VERSION == 0 && NODE_MINOR_VERSION == 10
# define SL_NODE_VERSION 10  // v0.10
#else
# error "Unsupported node.js version."
#endif

#include "util.h"
#include "util-inl.h"

#include "compat.h"
#include "compat-inl.h"

namespace strongloop {
namespace agent {

namespace extras { void Initialize(v8::Isolate*, v8::Local<v8::Object>); }
namespace gcinfo { void Initialize(v8::Isolate*, v8::Local<v8::Object>); }
namespace heapdiff { void Initialize(v8::Isolate*, v8::Local<v8::Object>); }
namespace profiler { void Initialize(v8::Isolate*, v8::Local<v8::Object>); }
namespace uvmon { void Initialize(v8::Isolate*, v8::Local<v8::Object>); }
namespace platform { void CpuTime(double* total_system, double* total_user); }

}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_STRONG_AGENT_H_
