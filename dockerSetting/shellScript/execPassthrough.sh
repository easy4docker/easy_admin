#!/bin/bash

APP_DIR="/var/_localApp"
DATA_DIR="/var/_localAppData"
markfile=${DATA_DIR}/siteCommCronMark.txt

# --- clean longer time task -----
for file in $(find $markfile -not -newermt '-120 seconds' 2>&1) ;do
  if [ -f "$markfile" ]; then
    vfn=$(<$markfile)
    cmda="rm -fr $vfn && pkill -f $vfn > /dev/null && rm -fr $markfile >/dev/null 2>&1"
    eval "$cmda"
  fi
done

cd ${APP_DIR}/cronjob/ && node minute_cron.js  > ${DATA_DIR}/log/minCron.txt