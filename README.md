# codehub

Competitive programming web application based on microservice architecture

## Component architecture

![Component diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/nemaberci/codehub/master/specification/components.plantuml)

## Useful commands

* To create a private key, use `ssh-keygen -m pem -f <keyname>.pem`
* To create the public key of the created private key, use `ssh-keygen -f <keyname>.pem.pub -e -m pkcs8` and print the
  results into the public key file

## Kubernetes Service accounts

|    namespace |         k8s service account |                                 gcp service account |
|-------------:|----------------------------:|----------------------------------------------------:|
|         user |                        user |     user-acc@codehub-400314.iam.gserviceaccount.com |
|       runner |                      runner |       runner@codehub-400314.iam.gserviceaccount.com |
|      builder |                     builder |      builder@codehub-400314.iam.gserviceaccount.com |
|    challenge |                   challenge |    challenge@codehub-400314.iam.gserviceaccount.com |
|     solution |                    solution |     solution@codehub-400314.iam.gserviceaccount.com |
| filehandling | filehandling-serviceaccount | filehandling@codehub-400314.iam.gserviceaccount.com |
|     frontend |                    frontend |     frontend@codehub-400314.iam.gserviceaccount.com |
