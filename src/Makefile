# Copyright (c) 2014, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

PREFIX ?= $(dir $(lastword $(MAKEFILE_LIST)))

PYTHON ?= python

CLANG_FORMAT ?= clang-format

# Exclude queue.h, it's borrowed from libuv and doesn't adhere to the coding
# style.
SOURCES = \
	compat-inl.h \
	compat.h \
	counters.h \
	dyninst.h \
	extras.h \
	gcinfo.h \
	heapdiff.h \
	platform-posix.h \
	platform-win32.h \
	profiler.h \
	strong-agent.cc \
	strong-agent.h \
	util-inl.h \
	util.h \
	uvmon.h \

SOURCES := $(SOURCES:%=$(PREFIX)%)

# Disable build/include, it complains that "foo.h" includes should prefix the
# header name with the directory name but that's incompatible with node-gyp.
#
# Disable build/include_order, it wants system headers before project headers
# but we want to catch bugs where project headers have implicit dependencies
# on system headers included in source files.
FILTER = -build/include,-build/include_order

.PHONY: check-imports lint clang-format

lint: check-imports
	$(PYTHON) $(PREFIX)cpplint.py --filter=$(FILTER) $(SOURCES)

check-imports:
	$(SHELL) $(PREFIX)check-imports.sh $(SOURCES)

clang-format:
	$(CLANG_FORMAT) -i $(SOURCES)
