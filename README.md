# codehub

Competitive programming web application based on microservice architecture

## Component architecture

![Component diagram](http://www.plantuml.com/plantuml/proxy?cache=no&src=https://raw.githubusercontent.com/nemaberci/codehub/master/specification/components.plantuml)

## Useful commands

* To create a private key, use `ssh-keygen -m pem -f <keyname>.pem`
* To create the public key of the created private key, use `ssh-keygen -f <keyname>.pem.pub -e -m pkcs8` and print the
  results into the public key file
* To build a docker image, use
    * `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/<imagename>:<tag> -f <dockerfile> .`
    * `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/<imagename>:<tag>`
* To create a new service account, the following commands are required:
    * `kubectl create namespace <namespace>`
    * `kubectl create serviceaccount <serviceaccount_gke> --namespace <namespace>`
    * `gcloud iam service-accounts create <serviceaccount_gcloud> --project=codehub-400314`
    *
    `gcloud projects add-iam-policy-binding codehub-400314 --member "serviceAccount:<serviceaccount_gcloud>@codehub-400314.iam.gserviceaccount.com --role=<role>`
    *
    `gcloud iam service-accounts add-iam-policy-binding <serviceaccount_gcloud>@codehub-400314.iam.gserviceaccount.com --member="serviceAccount:codehub-400314.svc.id.goog[<namespace>/<serviceaccount_gke>]" --role="roles/iam.workloadIdentityUser"`
    *
    `kubectl annotate serviceaccount <serviceaccount_gke> --namespace <namespace> iam.gke.io/gcp-service-account=<serviceaccount_gcloud>@codehub-400314.iam.gserviceaccount.com`

| name         | build script                                                                                                                | push script                                                                                 |
|--------------|-----------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|
| challenge    | `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/challenge:latest -f Challenge.dockerfile .`       | `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/challenge:latest`     |
| solution     | `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/solution:latest -f Solution.dockerfile .`         | `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/solution:latest`      |
| user         | `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/user:latest -f User.dockerfile .`                 | `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/user:latest`          |
| filehandling | `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/file-handling:latest -f FileHandling.dockerfile .` | `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/file-handling:latest` |
| frontend     | `docker build -t europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/frontend:latest .`          | `docker push europe-west4-docker.pkg.dev/codehub-400314/code-hub-main/frontend:latest`      |

## Kubernetes Service accounts

|    namespace | k8s service account |                                 gcp service account |
|-------------:|--------------------:|----------------------------------------------------:|
|         user |                user |     user-acc@codehub-400314.iam.gserviceaccount.com |
|       runner |              runner |       runner@codehub-400314.iam.gserviceaccount.com |
|      builder |             builder |      builder@codehub-400314.iam.gserviceaccount.com |
|    challenge |           challenge |    challenge@codehub-400314.iam.gserviceaccount.com |
|     solution |            solution |     solution@codehub-400314.iam.gserviceaccount.com |
| filehandling |        filehandling | filehandling@codehub-400314.iam.gserviceaccount.com |
|     frontend |            frontend |     frontend@codehub-400314.iam.gserviceaccount.com |

