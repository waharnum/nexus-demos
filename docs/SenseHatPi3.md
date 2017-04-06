Write the Raspbian OS image to an SD card
-----------------------------------------

I used Raspbian Jessie Lite:

- https://www.raspberrypi.org/downloads/raspbian/
- https://downloads.raspberrypi.org/raspbian_lite_latest

Enable ssh login
----------------

As of November 2016, ssh is disabled by default in Raspbian. To enable,
make a file called "ssh" in the root of the SD card boot partition.

See: https://www.raspberrypi.org/documentation/remote-access/ssh/

Set the hostname before first boot
----------------------------------

The default hostname is "raspberrypi".

With the SD card mounted, edit:

- /etc/hostname
- /etc/hosts

Boot the Pi
-----------

- Unmount the SD card, move it to the Raspberry Pi
- Plug in a network cable
- Power on

Default user credentials
------------------------

- Username: pi
- Password: raspberry

Change password
---------------

    $ passwd

Update the OS
-------------

    $ sudo apt update
    $ sudo apt full-upgrade

Changing the hostname on a running Pi
-------------------------------------

- /etc/hostname
- /etc/hosts

The hostname change will not take effect until reboot. To change the
hostname right away:

    $ sudo hostname NEW-HOSTNAME

The avahi-daemon service is running by default.

If the hostname has been changed as above before rebooting, and it is
desired to find the Pi on the network using the new hostname, it will be
necessary to restart the avahi-daemon so that it will pick up the new
hostname:

    $ sudo systemctl restart avahi-daemon

Install Node.js
---------------

The Raspberry Pi 3 has an ARMv7 processor.

    $ cd ~
    $ mkdir Downloads
    $ cd Downloads
    $ wget https://nodejs.org/dist/v6.10.2/node-v6.10.2-linux-armv7l.tar.xz
    $ cd /opt
    $ sudo tar xf /home/pi/Downloads/node-v6.10.2-linux-armv7l.tar.xz

Add the Node.js bin directory to the pi user `PATH` in `.profile`:

    PATH=$PATH:/opt/node-v6.10.2-linux-armv7l/bin

Install git
-----------

    $ sudo apt install git

Get the Nexus Demos
-------------------

    $ cd ~
    $ git clone https://github.com/simonbates/nexus-demos.git
    $ cd nexus-demos
    $ npm install
