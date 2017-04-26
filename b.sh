#!/usr/bin/env bash

versionCfgFile="version.cfg"

if [ -e ${versionCfgFile} ]; then
	version=$(cat ${versionCfgFile})
	echo ${version}
else
	version=0
	echo ${versionCfgFile} file not exits
fi

version=$(expr ${version} + 1)
echo ${version} > ${versionCfgFile}

comment="blog data v2.0.$version"

gulp \
    && cp -r ./dist/ ./docs/ \
    && git commit -am "$comment" \
    && git push origin master

echo ${comment}
