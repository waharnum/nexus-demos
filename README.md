Nexus Examples
==============

This repository contains some examples of using the GPII Nexus
integration technology.

Getting the examples and installing dependencies
------------------------------------------------

```
$ git clone https://github.com/simonbates/nexus-examples.git
$ cd nexus-examples
$ npm install
```

Running the examples
--------------------

### 1. Run the Nexus

Run the Nexus.

### 2. Construct the Nexus peers

```
> node examples/constructNexusPeers.js
```

### 4. Serve and visit the examples web pages

This repo contains a simple static webserver configuration, or you can
use a webserver that you've already got set up.

There is a top level `index.html` with links to the individual
examples.

To use the webserver configured in `nexus-examples`:

```
$ node nexus-examples.js
```

Then, point your web browser to:

- [http://localhost:8080/](http://localhost:8080/)

### 3. Run AsTeRICS ACS and ARE, and load the model

- Use the AsTeRICS fork with the NexusConnector component at https://github.com/simonbates/AsTeRICS/tree/GPII-1543
- Run ACS
- Run ARE
- Upload and run the `examples/AsTeRICS/Facetracker to NexusConnector.acs` model

Instructions for building the ARE can be found here:
https://github.com/simonbates/AsTeRICS/blob/GPII-1543/ReadMe.md

If you are running AsTeRICS on a different machine from the Nexus, you
will need to tell the NexusConnector AsTeRICS component where to
connect to. At this point in development, the URL is hardcoded in the
NexusConnector source code and you will need to edit the source and
rebuild the component. The source code for the NexusConnector
component can be found at this point in the source tree:

- https://github.com/simonbates/AsTeRICS/blob/GPII-1543/ARE/components/processor.nexusconnector/src/main/java/eu/asterics/component/processor/nexusconnector/NexusConnectorInstance.java

Look for `ws://localhost:9081/bindModel/nexus.asterics/inputs`
