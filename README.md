Nexus Demos
===========

This repository contains some demos showing usage of the GPII Nexus
integration technology:

- A music demo
- A science lab demo

Getting the demos and installing dependencies
---------------------------------------------

```
> git clone https://github.com/simonbates/nexus-demos.git
> cd nexus-demos
> npm install
```

Running the demos
-----------------

Each of the demos requires a running Nexus and the hosting of web
pages. This section describes the steps that are common to all of
the demos. Sections following will contain demo-specific
information.

### 1. Run the Nexus

Run the Nexus.

### 2. Serve and visit the demo web pages

This repo contains a simple static webserver configuration, or you can
use a webserver that you've already got set up.

There is a top level `index.html` with links to the individual
demos.

To use the webserver configured in `nexus-demos`:

```
> node nexus-demos.js
```

Then, point your web browser to:

- [http://localhost:8080/](http://localhost:8080/)

Music demo
----------

### 1. Construct the Nexus peers for the music demo

```
> node music-demo/constructNexusPeers.js
```


### 2. Run AsTeRICS ACS and ARE, and load a model

- Use the AsTeRICS fork with the NexusConnector component at https://github.com/simonbates/AsTeRICS/tree/GPII-1543
- Run ACS
- Run ARE
- Upload and run one of the models in `asterics-models` such as `Facetracker to NexusConnector.acs`

Instructions for building the ARE can be found here:
https://github.com/simonbates/AsTeRICS/blob/GPII-1543/ReadMe.md

The AsTeRICS NexusConnector component has properties for configuring
the address of the Nexus instance to connect to and the component path
to bind to. It has the following properties:

- nexusHostname
- nexusPort
- nexusComponentPath

Science lab demo
----------------

### 1. Configure the Nexus for the science lab demo

```
> node science-lab/ConstructScienceLabPeersAndRecipes.js
```

### 2. Attach sensors

We currently have a driver for Atlas Scientific pH and Electrical
Conductivity sensors. This driver may be found in the
`science-lab/atlas-scientific-driver` directory and can be run in
2 ways:

- `MonitorSerialDevice.sh DEVICE_PATH`
    - For example: `MonitorSerialDevice.sh /dev/ttyUSB0`
    - Continually monitors the device at the provided path
    - When the device is present, it will attempt to establish a
      serial connection (by running `RunAtlasScientificDriver.js`
      below)
    - When the device is removed, it will continue to monitor for
      the device to appear again
- `node RunAtlasScientificDriver.js --device DEVICE_PATH`
    - Runs the driver for the specified device
    - Terminates if the device is not available or if the device
      is removed

For testing, we also provide `science-lab/FakeSensor.js`
