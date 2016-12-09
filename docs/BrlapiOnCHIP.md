Install dependencies:

    $ sudo apt install brltty python3 python3-brlapi

Test with python3:

    $ sudo python3
    >>> import brlapi
    >>> brl = brlapi.Connection()
    >>> brl.enterTtyMode(1)
    >>> brl.writeText('hello, world')

Create a systemd service at `/lib/systemd/system/nexus_braille_display.service`:

    [Unit]
    Description=Nexus Braille display driver
    Requires=brltty.service
    After=brltty.service

    [Service]
    ExecStart=/usr/bin/python3 /home/chip/projects/nexus-demos/braille-display-driver/braille_display_driver.py
    Restart=on-failure

    [Install]
    WantedBy=multi-user.target

Connect to the `nexusnet` network:

    $ sudo nmcli device wifi connect nexusnet ifname wlan0

Check connection status:

    $ nmcli device status
    $ /sbin/ifconfig

(The NetworkManager configuration files are stored in `/etc/NetworkManager`)

See: http://docs.getchip.com/chip.html#wifi-connection
