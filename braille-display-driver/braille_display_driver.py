# $ python3 -m venv --system-site-packages env
# $ source env/bin/activate
# $ pip install ws4py

import json
import brlapi
from ws4py.client.threadedclient import WebSocketClient

nexus_host = 'nexuschip.local'
nexus_port = 9081
nexus_peer = 'nexus.brailleDisplay'
tty = 1

class BrailleDisplayClient(WebSocketClient):
    def init_braille_display(self, tty):
        self.brl = brlapi.Connection()
        self.brl.enterTtyMode(tty)

    def received_message(self, m):
        # TODO: Do I have to deal with multi-part messages?
        if m.is_text:
            text = json.loads(str(m))
            if isinstance(text, str):
                self.brl.writeText(text)

if __name__ == '__main__':
    nexus_peer_endpoint = 'ws://%s:%d/bindModel/%s/displayText' % (nexus_host, nexus_port, nexus_peer)
    client = BrailleDisplayClient(nexus_peer_endpoint)
    client.init_braille_display(tty)
    client.connect()
    client.run_forever()
