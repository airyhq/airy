module "minikube" {
  source = "github.com/airyhq/airy.git/infrastructure/terraform/modules/minikube"
  kubeconfig_output_path = "../kube.conf"
}
