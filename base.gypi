# Copyright (c) 2015, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

{
  'cflags': [
    '-fvisibility=hidden',
    '-fno-exceptions',
    '-fno-omit-frame-pointer',  # Make sure we have stack frames to walk.
    '-fno-rtti',
    '-fno-strict-aliasing',
    '-Wall',
    '-Wextra',
  ],
  'include_dirs': ['deps/chromium'],
  'conditions': [
    ['OS == "mac"', {
      'defines': ['_DARWIN_C_SOURCE', '_XOPEN_SOURCE=500'],  # ucontext.h
    }],
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
}
