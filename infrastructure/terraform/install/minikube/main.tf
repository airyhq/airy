module "minikube" {
  #source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/minikube"
  source = "../../modules/minikube"

  kubeconfig_output_path = "../kube.conf"
}
