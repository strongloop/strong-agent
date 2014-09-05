# Copyright (c) 2014, StrongLoop Inc.
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

PREFIX ?= $(dir $(lastword $(MAKEFILE_LIST)))

PYTHON ?= python

CLANG_FORMAT ?= clang-format

# Exclude queue.h, it's borrowed from libuv and doesn't adhere to the coding
# style.
SOURCES = \
	compat-inl.h \
	compat.h \
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
