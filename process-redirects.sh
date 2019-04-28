#!/bin/bash

set -eu
set -o pipefail

while read QTY ROUTE ; do
    LOCATION=$(/usr/bin/GET -Ssed https://ry4an.org${ROUTE} | /bin/grep Location | cut -d ' ' -f 2) || continue
    if [ -z "$LOCATION" ] ; then
        continue
    fi
    echo $QTY $ROUTE $LOCATION
done < all-redirects
