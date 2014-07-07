// Copyright (c) 2014, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#ifndef AGENT_SRC_PLATFORM_POSIX_H_
#define AGENT_SRC_PLATFORM_POSIX_H_

#include "strong-agent.h"

#include <sys/time.h>
#include <sys/resource.h>

namespace strongloop {
namespace agent {
namespace platform {

void CpuTime(double* total_system, double* total_user) {
  rusage usage;
  if (::getrusage(RUSAGE_SELF, &usage)) {
    // Error.  Just return zeroes.
    *total_system = 0;
    *total_user = 0;
  } else {
    *total_system = usage.ru_stime.tv_sec + usage.ru_stime.tv_usec / 1e6;
    *total_user = usage.ru_utime.tv_sec + usage.ru_utime.tv_usec / 1e6;
  }
}

}  // namespace platform
}  // namespace agent
}  // namespace strongloop

#endif  // AGENT_SRC_PLATFORM_POSIX_H_
