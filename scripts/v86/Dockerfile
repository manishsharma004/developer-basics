# Alpine i386 rootfs for v86 with Podman (container lab).
# Based on https://github.com/copy/v86/tree/master/tools/docker/alpine
FROM docker.io/i386/alpine:3.21.0

ENV KERNEL=virt
ENV ADDPKGS="bash curl podman podman-docker podman-compose"

RUN apk add --no-cache openrc alpine-base agetty alpine-conf \
    linux-$KERNEL linux-firmware-none $ADDPKGS

RUN sed -i 's/getty 38400 tty1/agetty --autologin root tty1 linux/' /etc/inittab
RUN echo 'ttyS0::respawn:/sbin/agetty --autologin root -s ttyS0 115200 vt100' >> /etc/inittab
RUN echo "root:" | chpasswd

RUN setup-hostname localhost

RUN echo -e "rmmod ne2k-pci && modprobe ne2k-pci\nrmmod virtio-net && modprobe virtio-net\nhwclock -s\nsetup-interfaces -a -r" > /root/networking.sh && chmod +x /root/networking.sh

RUN for i in devfs dmesg mdev hwdrivers; do rc-update add $i sysinit; done
RUN for i in hwclock modules sysctl hostname syslog bootmisc; do rc-update add $i boot; done
RUN rc-update add killprocs shutdown

RUN mkdir -p /home/lab /opt/lab /var/lab

COPY lab-init.sh /etc/profile.d/lab-init.sh
COPY lab/ /home/lab/
COPY opt-lab/ /opt/lab/

RUN mkinitfs -F "base virtio 9p" $(cat /usr/share/kernel/$KERNEL/kernel.release)
