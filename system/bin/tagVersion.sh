#!/bin/bash

# tag the release
echo "Taging version $1"
git tag -a $1 -m "version $1"

# create versionfile
path="`dirname \"$0\"`"
outfile="$path/../version.build"
versionscript="$path/version.sh"

echo "Creating versionfile: $outfile"

version="`$versionscript`"
echo "Version: $version"
echo "$version" > $outfile

#echo pushing tag to upstream
#git push --tags

echo "done."