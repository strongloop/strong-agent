# Copyright (c) 2015, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

{
  'targets': [
    {
      'target_name': 'cctest',
      'type': 'executable',
      'includes': ['../../base.gypi'],
      'include_dirs': ['../../src'],
      'dependencies': ['../../deps/gtest/gtest.gyp:gtest'],
      'defines': [
        # gtest's ASSERT macros conflict with our own.
        'GTEST_DONT_DEFINE_ASSERT_EQ=1',
        'GTEST_DONT_DEFINE_ASSERT_GE=1',
        'GTEST_DONT_DEFINE_ASSERT_GT=1',
        'GTEST_DONT_DEFINE_ASSERT_LE=1',
        'GTEST_DONT_DEFINE_ASSERT_LT=1',
        'GTEST_DONT_DEFINE_ASSERT_NE=1',
      ],
      'sources': [
        'test-cpu-profiler.cc',
      ],
    },
  ],
}
