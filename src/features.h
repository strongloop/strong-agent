// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_FEATURES_H_
#define AGENT_SRC_FEATURES_H_

#if defined(__clang__)
#define SL_COMPILER_CLANG 1
#endif

#if defined(__GNUC__)
#define SL_COMPILER_GCC 1
#endif

#if defined(_MSC_VER)
#define SL_COMPILER_MSVC 1
#endif

#if defined(__APPLE__)
#define SL_OS_DARWIN 1
#endif

#if defined(__FreeBSD__)
#define SL_OS_FREEBSD 1
#endif

#if defined(__linux__)
#define SL_OS_LINUX 1
#endif

#if defined(_WIN32)
#define SL_OS_WINDOWS 1
#endif

#if defined(__sun)
#define SL_OS_SOLARIS 1
#endif

#if !defined(SL_OS_WINDOWS)
#define SL_OS_POSIX 1
#endif

#if defined(__arm__) || defined(_M_ARM)
#define SL_CPU_ARM 1
#endif

#if defined(__arm64__) || defined(__aarch64__)
#define SL_CPU_ARM64 1
#endif

#if defined(__mips__)
#define SL_CPU_MIPS 1
#endif

#if defined(__x86_64__) || defined(_M_X64)
#define SL_CPU_X86_64 1
#endif

#if defined(SL_CPU_ARM) && defined(__ARM_PCS_VFP)
#define SL_CPU_ARM_HARDFP 1
#endif

#if defined(SL_CPU_ARM) && defined(__ARMEB__)
#define SL_CPU_BIG_ENDIAN 1
#endif

#if defined(SL_CPU_MIPS) && defined(__MIPSEB__)
#define SL_CPU_BIG_ENDIAN 1
#endif

#if defined(SL_COMPILER_CLANG)
#define SL_CLANG_AT_LEAST(major, minor, patch)             \
  (__clang_major__ > major ||                              \
   __clang_major__ == major && __clang_minor__ > minor ||  \
   __clang_major__ == major && __clang_minor__ == minor && \
       __clang_patchlevel__ >= patch)
#else
#define SL_CLANG_AT_LEAST(major, minor, patch) 0
#endif

#if defined(SL_COMPILER_GCC)
#define SL_GCC_AT_LEAST(major, minor, patch)                          \
  (__GNUC__ > major || __GNUC__ == major && __GNUC_MINOR__ > minor || \
   __GNUC__ == major && __GNUC_MINOR__ == minor &&                    \
       __GNUC_PATCHLEVEL__ >= patch)
#else
#define SL_GCC_AT_LEAST(major, minor, patch) 0
#endif

#endif  // AGENT_SRC_FEATURES_H_
