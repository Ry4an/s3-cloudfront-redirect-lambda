#!/bin/bash
cd /srv/www/ry4an
aws s3 sync --exclude 'resume/*' --exclude 'unblog/*' "$@" . s3://ry4an.org-origin/
