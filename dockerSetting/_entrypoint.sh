#!/bin/bash
sed '/\echo _EASY_MIN_CRON/d' /etc/crontab  > /tmp/crontab_easy_min_cron
cp -f /tmp/crontab_easy_min_cron  /etc/crontab
rm -fr /tmp/crontab_easy_min_cron
echo "* * * * * root (echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 2 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 4 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 6 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 8 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 10 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 12 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 14 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 16 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 18 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 20 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 22 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 24 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 26 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 28 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 30 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 32 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 34 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 36 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 38 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 40 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 42 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 44 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 46 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 48 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 50 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 52 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 54 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 56 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab
echo "* * * * * root (sleep 58 && echo _EASY_MIN_CRON && cd /var/_localApp/cronjob/ && node minute_cron.js  > /var/_localAppData/log/minCron.txt)" >> /etc/crontab

cd /var/_localApp
node server.js >> /var/_localAppData/log/console_out.txt
