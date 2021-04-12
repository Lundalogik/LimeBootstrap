#!/bin/bash
revisioncount=`git log --oneline | wc -l | tr -d ' '`
projectversion=`git describe --tags --long`
cleanversion=${projectversion%%-*}
echo "$cleanversion.$revisioncount"