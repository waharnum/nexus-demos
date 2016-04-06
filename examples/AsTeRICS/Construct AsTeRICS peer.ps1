Invoke-WebRequest http://localhost:9081/components/nexus -Method Post -Headers @{"Content-Type" = "application/json"} -Body '{ "type": "fluid.modelComponent" }'

Invoke-WebRequest http://localhost:9081/components/nexus.asterics -Method Post -Headers @{"Content-Type" = "application/json"} -Body '{ "type": "fluid.modelComponent", "model": { "inputs": { "a": 0, "b": 0, "c": 0, "d": 0 } } }'
