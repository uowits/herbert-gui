#!/bin/bash

for component in bower_components/*;
do
    cp -R $component/dist/* published/
done;