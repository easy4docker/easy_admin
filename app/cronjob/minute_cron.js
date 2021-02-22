var fs = require('fs');
var env = {
    root : __dirname,
    dataFolder : '/var/_localAppData',
    appFolder : '/var/_localApp'
}
console.log(new Date());
console.log(env)
/*

for f in "${SITES_PATH}"/*; do
  if [ -f "${f}/data/commCron/REMOVE.ME" ]; then
      mv -f ${f}/data/commCron/REMOVE.ME ${CRON_PATH}/$(date +"%H%M%S")_REMOVE.ME
  else
    exit 1
  fi
done

*/