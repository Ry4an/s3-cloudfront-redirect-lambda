#!/bin/bash
cd /var/www/ry4an
aws s3 sync . s3://ry4an.org-origin/
