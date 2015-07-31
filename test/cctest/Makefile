# Copyright (c) 2015, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

NODE_GYP ?= node-gyp

.PHONY: all cctest clean

all cctest:
	$(NODE_GYP) --debug rebuild
	build/Debug/cctest

clean:
	$(NODE_GYP) clean
