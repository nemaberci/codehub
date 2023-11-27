# codehub
Competitive programming web application based on microservice architecture

## Component architecture

![Component diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/nemaberci/codehub/master/specification/components.plantuml)

## Useful commands

* To create a private key, use `ssh-keygen -m pem -f <keyname>.pem`
* To create the public key of the created private key, use `ssh-keygen -f <keyname>.pem.pub -e -m pkcs8` and print the results into the public key file