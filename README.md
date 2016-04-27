Nexus Demos
===========

This repository contains some demos showing the GPII Nexus integration
technology.

Getting the demos and installing dependencies
---------------------------------------------

```
$ git clone https://github.com/simonbates/nexus-demos.git
$ cd nexus-demos
$ npm install
```

Running the demos
-----------------

### 1. Run the Nexus

Run the Nexus.

### 2. Construct the Nexus peers

```
> node demos/constructNexusPeers.js
```

### 3. Serve and visit the demo web pages

This repo contains a simple static webserver configuration, or you can
use a webserver that you've already got set up.

There is a top level `index.html` with links to the individual
demos.

To use the webserver configured in `nexus-demos`:

```
$ node nexus-demos.js
```

Then, point your web browser to:

- [http://localhost:8080/](http://localhost:8080/)

### 4. Run AsTeRICS ACS and ARE, and load a model

- Use the AsTeRICS fork with the NexusConnector component at https://github.com/simonbates/AsTeRICS/tree/GPII-1543
- Run ACS
- Run ARE
- Upload and run one of the models in `demos/AsTeRICS` such as `Facetracker to NexusConnector.acs`

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
