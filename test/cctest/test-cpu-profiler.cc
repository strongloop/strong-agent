// Copyright (c) 2015, StrongLoop Inc.
//
// This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
// in the top-level directory or visit http://strongloop.com/license.

#include "gtest/gtest.h"
#include "cpu-profiler-util.h"

#include <string>

TEST(CpuProfilerTest, ParseJSFunctionName) {
  using namespace strongloop::agent::cpuprofiler;

  size_t function_name_size;
  size_t function_name_offset;
  size_t script_name_offset;
  size_t script_name_size;
  uint32_t line_number;

  {
    const char name[] = "";
    const size_t size = sizeof(name) - 1;
    EXPECT_FALSE(ParseJSFunctionName(name, size,
                                     &function_name_offset, &function_name_size,
                                     &script_name_offset, &script_name_size,
                                     &line_number));
  }

  {
    const char name[] = "foobarbaz";
    const size_t size = sizeof(name) - 1;
    EXPECT_FALSE(ParseJSFunctionName(name, size,
                                     &function_name_offset, &function_name_size,
                                     &script_name_offset, &script_name_size,
                                     &line_number));
  }

  {
    const char name[] = "Builtin:A builtin from the snapshot";
    const size_t size = sizeof(name) - 1;
    EXPECT_FALSE(ParseJSFunctionName(name, size,
                                     &function_name_offset, &function_name_size,
                                     &script_name_offset, &script_name_size,
                                     &line_number));
  }

  {
    const char name[] = "foobarbaz script.js:42";
    const size_t size = sizeof(name) - 1;
    EXPECT_TRUE(ParseJSFunctionName(name, size,
                                    &function_name_offset, &function_name_size,
                                    &script_name_offset, &script_name_size,
                                    &line_number));
    std::string function_name(name + function_name_offset, function_name_size);
    std::string script_name(name + script_name_offset, script_name_size);
    EXPECT_EQ("foobarbaz", function_name);
    EXPECT_EQ("script.js", script_name);
    EXPECT_EQ(42U, line_number);
  }

  {
    const char name[] = "LazyCompile: /foo/bar/baz.js:42";
    const size_t size = sizeof(name) - 1;
    EXPECT_TRUE(ParseJSFunctionName(name, size,
                                    &function_name_offset, &function_name_size,
                                    &script_name_offset, &script_name_size,
                                    &line_number));
    std::string function_name(name + function_name_offset, function_name_size);
    std::string script_name(name + script_name_offset, script_name_size);
    EXPECT_EQ("", function_name);
    EXPECT_EQ("/foo/bar/baz.js", script_name);
    EXPECT_EQ(42U, line_number);
  }

  {
    const char name[] = "LazyCompile:*busy C:\\Program Files\\node\\test.js:42";
    const size_t size = sizeof(name) - 1;
    EXPECT_TRUE(ParseJSFunctionName(name, size,
                                    &function_name_offset, &function_name_size,
                                    &script_name_offset, &script_name_size,
                                    &line_number));
    std::string function_name(name + function_name_offset, function_name_size);
    std::string script_name(name + script_name_offset, script_name_size);
    EXPECT_EQ("busy", function_name);
    EXPECT_EQ("C:\\Program Files\\node\\test.js", script_name);
    EXPECT_EQ(42U, line_number);
  }

  {
    const char name[] = "Script:~C:\\Program Files\\node\\test.js";
    const size_t size = sizeof(name) - 1;
    EXPECT_TRUE(ParseJSFunctionName(name, size,
                                    &function_name_offset, &function_name_size,
                                    &script_name_offset, &script_name_size,
                                    &line_number));
    std::string function_name(name + function_name_offset, function_name_size);
    std::string script_name(name + script_name_offset, script_name_size);
    EXPECT_EQ("", function_name);
    EXPECT_EQ("C:\\Program Files\\node\\test.js", script_name);
    EXPECT_EQ(0U, line_number);
  }
}
