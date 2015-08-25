# Copyright (c) 2014, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

{
  'targets': [
    {
      'target_name': 'strong-agent',
      'cflags': [
        '-fvisibility=hidden',
        '-fno-exceptions',
        '-fno-rtti',
        '-fno-strict-aliasing',
        '-Wall',
        '-Wextra',
      ],
      # Need to repeat the compiler flags in xcode-specific lingo,
      # gyp on mac ignores the cflags field.
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'NO',
        'GCC_ENABLE_CPP_RTTI': 'NO',
        # -Wno-invalid-offsetof is only necessary for gcc 4.2,
        # it prints bogus warnings for POD types.
        'GCC_WARN_ABOUT_INVALID_OFFSETOF_MACRO': 'NO',
        # -fvisibility=hidden
        'GCC_SYMBOLS_PRIVATE_EXTERN': 'YES',
        'WARNING_CFLAGS': ['-Wall', '-Wextra'],
      },
      'sources': [
        'src/compat-inl.h',
        'src/compat.h',
        'src/counters.h',
        'src/dyninst.h',
        'src/extras.h',
        'src/features.h',
        'src/gcinfo.h',
        'src/heapdiff.h',
        'src/platform-posix.h',
        'src/platform-win32.h',
        'src/profiler.h',
        'src/strong-agent.cc',
        'src/strong-agent.h',
        'src/uvmon.h',
        'src/watchdog.h',
      ],
    }
  ]
}
