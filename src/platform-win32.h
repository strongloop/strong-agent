// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_PLATFORM_WIN32_H_
#define AGENT_SRC_PLATFORM_WIN32_H_

#include "strong-agent.h"

#include <stdint.h>
#include <windows.h>

namespace strongloop {
namespace agent {
namespace platform {

namespace internal {

inline double FileTimeToFractionalSeconds(const FILETIME* time) {
  uint64_t hi = static_cast<uint64_t>(time->dwHighDateTime);
  uint64_t lo = static_cast<uint64_t>(time->dwLowDateTime);
  return (lo | (hi << 32)) / 1e7;
}

}  // namespace internal

void CpuTime(double* total_system, double* total_user) {
  FILETIME system_time;
  FILETIME user_time;
  FILETIME unused0;
  FILETIME unused1;
  HANDLE self;

  self = ::GetCurrentProcess();
  if (::GetProcessTimes(self, &unused0, &unused1, &system_time, &user_time)) {
    *total_system = internal::FileTimeToFractionalSeconds(&system_time);
    *total_user = internal::FileTimeToFractionalSeconds(&user_time);
  } else {
    // Error.  Just return zeroes.
    *total_system = 0;
    *total_user = 0;
  }
}

}  // namespace platform
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_PLATFORM_WIN32_H_
