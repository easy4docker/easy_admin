APP_DIR="/var/_localApp"
DATA_DIR="/var/_localAppData"

cd ${APP_DIR}
node server.js >> ${DATA_DIR}/log/console_out.txt

stsCron=1
until [ $stsCron = 0 ]
do 
    if [ $stsCron != 0 ] ; then
        cd /var/shellScript
        sh execPassthrough.sh
        echo "test" >> ${DATA_DIR}/log/console_out.txt
    fi
    sleep 1
done