# airy.co GKS terraform installation source

### Title

The current referenced project link is ; 


- [Terraform GKE Registry](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster)
- [Github Project #1](https://github.com/hashicorp/learn-terraform-provision-gke-cluster)
- [Github Project #2](https://github.com/terraform-google-modules/terraform-google-kubernetes-engine)

## What is wrong


gcloud  container components  list 

gcloud init

Enable access to API ... for the  Google project for airy-core from GCP console


get  credentials gcloud

```
$ gcloud init
```

this need a browser allowence how to do fix it for CI
```
$ gcloud auth application-default login
```
gcloud config get-value project
