#!/usr/bin/env bash

gulp \
    && cp -r ./dist/ ./docs/ \
    && git commit -am "自动添加"
