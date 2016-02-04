Invoke-WebRequest http://localhost:9081/components/example1 -Method Post -Headers @{"Content-Type" = "application/json"} -Body '{ "type": "fluid.modelComponent", "model": { "a": null } }'
