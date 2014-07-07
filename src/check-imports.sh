#!/bin/sh

# Copyright (c) 2014, StrongLoop Inc.
#
# This software is covered by the StrongLoop License.  See StrongLoop-LICENSE
# in the top-level directory or visit http://strongloop.com/license.

SED=sed
STATUS=0
UNAME=`uname`

if [ "$UNAME" = Darwin ] || [ "$UNAME" = FreeBSD ]; then
  SED=gsed
fi

for FILE in $*; do
  if ! $SED -rne 's/^using (\w+::\w+);$/\1/p' $FILE | sort -c; then
    echo "in $FILE"
    STATUS=1
  fi
done

for FILE in $*; do
  for IMPORT in `$SED -rne 's/^using (\w+)::(\w+);$/\2/p' $FILE`; do
    if ! $SED -re '/^using (\w+)::(\w+);$/d' $FILE | grep -q "$IMPORT"; then
      echo "$IMPORT unused in $FILE"
      STATUS=1
    fi
  done
done

exit $STATUS
