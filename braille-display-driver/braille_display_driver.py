# $ python3 -m venv --system-site-packages env
# $ source env/bin/activate
# $ pip install ws4py

import json
import brlapi
from ws4py.client.threadedclient import WebSocketClient

class BrailleDisplayClient(WebSocketClient):
    def init_braille_display(self):
        self.brl = brlapi.Connection()
        self.brl.enterTtyMode()

    def received_message(self, m):
        # TODO: Do I have to deal with multi-part messages?
        if m.is_text:
            text = json.loads(str(m))
            if isinstance(text, str):
                self.brl.writeText(text)

if __name__ == '__main__':
    client = BrailleDisplayClient('ws://127.0.0.1:9081/bindModel/nexus.brailleDisplay/displayText')
    client.init_braille_display()
    client.connect()
    client.run_forever()
