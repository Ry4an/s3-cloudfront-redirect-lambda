#!/bin/bash

set -eu
set -o pipefail

while read QTY ROUTE TARGET ; do
    LOCATION=$(curl -s -i https://www.ry4an.org${ROUTE} | /bin/grep Location | sed 's/\r//g' | sed 's/www\.//g' | cut -d ' ' -f 2) || continue
    if [ -z "$LOCATION" ] ; then
        echo $QTY $ROUTE NO-MATCH NO-REDIRECT $TARGET
        continue
    fi
    if [ "$LOCATION" == "$TARGET" ] ; then
        MATCH="MATCH"
    else
        MATCH="NO-MATCH"
    fi
    echo $QTY $ROUTE $MATCH $LOCATION $TARGET
done < redirects-with-targets
