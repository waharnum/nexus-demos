Running Nexus on a C.H.I.P.
===========================

Flash the CHIP with the headless OS image
-----------------------------------------

See: http://docs.getchip.com/chip.html#flash-chip-with-an-os

First, do any operating system specific set up for the flasher:

- http://docs.getchip.com/chip.html#web-flasher-os-specific-issues

Put the CHIP into FEL mode:

- Use a jumper wire to connect the GND and FEL pins
- Connect the CHIP to a computer using a USB cable

On Linux, we can check that CHIP is in FEL mode with lsusb:

```
$ lsusb | grep -e 1f3a -e 18d1 -e 067b
Bus 003 Device 005: ID 1f3a:efe8 Onda (unverified) V972 tablet in flashing mode
```

Now we can install the OS image using the Chrome flasher:

- http://flash.getchip.com/

Log in over serial and secure the CHIP
--------------------------------------

```
$ picocom -b 115200 /dev/ttyACM0
```

To quit picocom: C-a C-x

See:

- http://docs.getchip.com/chip.html#headless-chip
- http://blog.nextthing.co/secure-a-chip/
- https://bbs.nextthing.co/t/setting-up-chip-as-a-headless-server-with-minimal-tools/1505

Change the password for the chip user:

```
$ passwd
```

Disable root ssh login:

Edit `/etc/ssh/sshd_config` and set

```
PermitRootLogin no
```

Restart sshd:

```
$ sudo service ssh restart
```

Disable the root user password:

```
$ sudo passwd -l root
```

Change the hostname:

- `/etc/hostname`
- `/etc/hosts`

Connect to the internet and update the OS
-----------------------------------------

I used a Nintendo Wii USB ethernet adapter with an ASIX AX88772 chipset (powered USB hub needed as the CHIP cannot power the ethernet adapter directly).

```
$ sudo apt update
$ sudo apt full-upgrade
```

Configure the wireless interface and access point
-------------------------------------------------

See: https://bbs.nextthing.co/t/create-a-very-basic-wifi-access-point/1727

Install dnsmasq:

```
$ sudo apt install dnsmasq
```

Create `/etc/dnsmasq.d/access_point.conf` with contents:

```
interface=wlan1
dhcp-range=172.20.0.100,172.20.0.250,1h
```

Edit `/etc/network/interfaces` and add:

```
auto wlan1

iface wlan1 inet static
  address 172.20.0.1
  netmask 255.255.255.0
```

Bring up the `wlan1` interface:

```
$ sudo ifup wlan1
```

And verify that we have the assigned static address:

```
$ /sbin/ifconfig
$ ip addr show wlan1
```

Restart `dnsmasq`:

```
$ sudo /etc/init.d/dnsmasq restart
```

Create `/etc/hostapd.conf` with contents:

```
interface=wlan1
driver=nl80211
ssid=nexusnet
channel=1
ctrl_interface=/var/run/hostapd
```

Start the access point:

```
$ sudo hostapd /etc/hostapd.conf
```

Install Node.js
---------------

The CHIP has an ARM7 processor.

```
$ wget https://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-armv7l.tar.xz
$ cd /opt
$ sudo tar xf /home/chip/Downloads/node-v6.9.1-linux-armv7l.tar.xz
```

Add the Node.js bin directory to the chip user `PATH` in `.profile`:

```
PATH=$PATH:/opt/node-v6.9.1-linux-armv7l/bin
```

Install git
-----------

```
$ sudo apt install git
```

Get Nexus and Nexus Demos
-------------------------

```
$ git clone https://github.com/GPII/nexus.git
$ git clone https://github.com/simonbates/nexus-demos.git
```
