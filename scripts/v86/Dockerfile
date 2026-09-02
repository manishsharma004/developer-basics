# Alpine i386 rootfs for v86 with Podman (container lab).
# Pin 3.18.x — v86 9p root is unreliable on Alpine 3.19+ (kernel 6.6+).
# See: https://github.com/copy/v86/discussions/989
FROM docker.io/i386/alpine:3.18.6

ENV KERNEL=virt
# compose is simulated via /opt/lab/compose.sh (not in Alpine 3.18 repos).
ENV ADDPKGS="bash curl podman podman-docker"

RUN apk add --no-cache openrc alpine-base agetty alpine-conf \
    linux-$KERNEL linux-firmware-none $ADDPKGS

# 3.18's mkinitfs lacks 9p feature files — install edge mkinitfs before initramfs generation.
RUN apk add --no-cache --allow-untrusted mkinitfs \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/main

# Ensure virtio + 9p modules are bundled for nlplug-findfs root=host9p mount.
RUN mkdir -p /etc/mkinitfs/modules.d && \
    printf '%s\n' virtio virtio_ring virtio_pci 9p 9pnet 9pnet_virtio \
    > /etc/mkinitfs/modules.d/v86-root.modules

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

RUN KERNEL_RELEASE="$(cat /usr/share/kernel/$KERNEL/kernel.release)" && \
    mkinitfs -L | grep -w 9p && \
    mkinitfs -F "base virtio 9p" "$KERNEL_RELEASE" && \
    INITRD="$(ls /boot/initramfs-${KERNEL_RELEASE}*)" && \
    gzip -dc "$INITRD" | cpio -t 2>/dev/null | grep -q 9pnet_virtio.ko
