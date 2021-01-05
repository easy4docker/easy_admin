   stsCron=1
   until [ $stsCron = 0 ]
   do 
       if [ $stsCron != 0 ] ; then
           sh _cron.sh &
       fi
       sleep 1
   done
