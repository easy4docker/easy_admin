# SCR_DIR=$(cd `dirname $0` && pwd)
SCR_DIR="$(dirname "$(cd `dirname $0` && pwd)")"
# SCRIPTFN=$(basename -- $SCR_DIR)
# DATA_DIR="$(dirname "$SCR_DIR")/_"$SCRIPTFN"_DATA"

DATA_DIR=${SCR_DIR}/data

CMD=""
CMD="${CMD}echo \"Start proxy ...\"\n";
CMD="${CMD}cd ${SCR_DIR}/nginx_proxy\n";
CMD="${CMD}docker build -t nginx-proxy-image  .\n";
CMD="${CMD}docker container stop nginx-proxy-container\n";
CMD="${CMD}docker container rm nginx-proxy-container\n";
CMD="${CMD}docker run -d -p 80:80 -v \"${SCR_DIR}/nginx_proxy/html\":/usr/share/nginx/html -v \"${DATA_DIR}/proxy\":/usr/share/nginx/proxy_config ";
CMD="${CMD} --network network_easydocker  ";
CMD="${CMD} --name nginx-proxy-container nginx-proxy-image\n";

shell_proxy="${DATA_DIR}/_cron/proxy_$(date +%s%N).sh"

mkdir -p ${DATA_DIR}/_cron/
echo "${CMD}" >> ${shell_proxy}