echo "Running at $(date) --->>\n"
cd /var/_localApp/cronjob
node minute_cron.js
echo "<<== Running end at $(date) \n"