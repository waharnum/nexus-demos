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

### 2. Construct the AsTeRICS Nexus peer

```
> & '.\examples\AsTeRICS\Construct AsTeRICS peer.ps1'
```

### 3. Run AsTeRICS ACS and ARE, and load the model

- Use the AsTeRICS fork with the NexusConnector component at https://github.com/simonbates/AsTeRICS/tree/GPII-1543
- Run ACS
- Run ARE
- Upload and run the `examples/AsTeRICS/Facetracker to NexusConnector.acs` model

### 4. Serve and visit the examples web pages

This repo contains a simple static webserver which can be used to run
the examples:

```
$ node nexus-examples.js
```

Then, point your web browser to:

- [http://localhost:8080/](http://localhost:8080/)
