#!/bin/bash
sed '/\echo _EASY_MIN_CRON/d' /etc/crontab  > /tmp/crontab_easy_min_cron
cp -f /tmp/crontab_easy_min_cron  /etc/crontab
rm -fr /tmp/crontab_easy_min_cron
echo "* * * * * root (echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  >> /var/_localAppData/log/minCron.txt)" >> /etc/crontab

cd /var/_localApp
node server.js >> /var/_localAppData/log/console_out.txt
