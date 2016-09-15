This directory contains a sample AsTeRICS Packaging Environment (APE)
project that uses the NexusConnector plugin.

For more information on APE, please see:
https://github.com/asterics/AsTeRICS/tree/master/bin/APE

This project is based on the [APE project template provided with
AsTeRICS](https://github.com/asterics/AsTeRICS/blob/master/bin/APE/template).

To build the project, execute `ant APE-copy` and provide the path to
your AsTeRICS Runtime Environment, for example:

```
> ant "-DARE.baseURI=E:\asterics\AsTeRICS\bin\ARE\" APE-copy
```

To run the built project:

```
> .\build\merged\bin\ARE\start.bat
```
