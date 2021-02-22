echo "Running at $(date) --->>\n"
cd /var/_localApp/cronjob
node minute_cron.js >> /var/_localAppData/log/minsCron.txt
echo "<<== Running end at $(date) \n"