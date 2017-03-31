Install Node.js
---------------

The Raspberry Pi 3 has an ARMv7 processor.

    $ wget https://nodejs.org/dist/v6.10.1/node-v6.10.1-linux-armv7l.tar.xz
    $ cd /opt
    $ sudo tar xf /home/pi/Downloads/node-v6.10.1-linux-armv7l.tar.xz

Add the Node.js bin directory to the pi user `PATH` in `.profile`:

    PATH=$PATH:/opt/node-v6.10.1-linux-armv7l/bin
