FROM ubuntu
MAINTAINER stefan.rinderle at gmail com

ADD keys/id_rsa.pub /root/.ssh/authorized_keys
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y openssh-server && apt-get clean && /etc/init.d/ssh start && /etc/init.d/ssh stop

VOLUME /tmp/containermount:/tmp/screenshots

EXPOSE 22
CMD ["/usr/sbin/sshd", "-D"]