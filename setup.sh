apt update
&& apt install sudo
&& apt install -y apt-transport-https ca-certificates curl software-properties-common
&& curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
&& add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
&& apt-cache policy docker-ce
&& apt install -y docker-ce
&& apt-get -y install git
