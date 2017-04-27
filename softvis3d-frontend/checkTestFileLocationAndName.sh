#!/usr/bin/env bash

for f in test/*/**/*.ts* ; do
  src_folder_string='src/'
  result_string="${f/test\//$src_folder_string}"

  result_string="${result_string/spec./}"

  if [[ -f ${result_string} ]]; then
    echo ${result_string} "FOUND"
  else
    echo ${result_string} "NOT FOUND - ERROR............"
    exit 1;
  fi
done;

exit 0;