#!/usr/bin/env bash

versionCfgFile="version.cfg"

if [ -e ${versionCfgFile} ]; then
	version=$(cat ${versionCfgFile})
	echo last version is ${version}
else
	version=0
	echo ${versionCfgFile} file not exits
fi

version=$(expr ${version} + 1)

comment="blog data v2.0.$version"

gulp \
    && rm -rf ./docs/ \
    && git checkout -- docs/CNAME \
    && git checkout -- docs/404.html \
    && cp -r ./dist/ ./docs/ \
    && echo ${version} > ${versionCfgFile} \
    && git add --all \
    && git commit -m "$comment" \
    && git push origin master

cp -r ./images/ ../images/ \
    && cd ../images/ \
    && git add --all \
    && git commit -m "$comment" \
    && git push origin master

cd ../caols.tech/

echo ${comment}
