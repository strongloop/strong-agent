# Copyright (c) 2014, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

PREFIX ?= $(dir $(lastword $(MAKEFILE_LIST)))

CLANG_FORMAT ?= clang-format

SOURCES := $(wildcard lib/*.js lib/*/*.js test/test-*.js test/*/*.js)
SOURCES := $(SOURCES:%=$(PREFIX)%)

.PHONY: all clang-format

all:
	@echo "Not doing any destructive updates."
	@echo "Did you mean to run \`make clang-format\`?"

# Note that clang-format needs to be r217311 or newer, clang 3.5 won't cut it.
clang-format:
	$(CLANG_FORMAT) -i $(SOURCES)
	$(MAKE) -C src $@
