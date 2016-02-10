Nexus Examples
==============

This repository contains some examples of using the GPII Nexus
integration technology.

Getting the examples and installing dependencies
------------------------------------------------

Clone the repository and submodules:

```
$ git clone https://github.com/simonbates/nexus-examples.git
$ cd nexus-examples
$ git submodule init
$ git submodule update
```

Install dependencies:

```
$ npm install
$ cd public/head-tracker-synth
$ npm install
```

Running the examples
--------------------

This repo contains a simple static webserver which can be used to run
the examples:

```
$ node nexus-examples.js
```

Then, point your web browser to:

- [http://localhost:8080/](http://localhost:8080/)
