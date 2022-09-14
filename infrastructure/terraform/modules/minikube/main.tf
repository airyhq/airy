resource "null_resource" "minikube" {
  triggers = {
    profile         = var.profile
    driver          = var.driver
    cpus            = var.cpus
    memory          = var.memory
    nodeport        = var.nodeport
    kubeconfig_output_path = var.kubeconfig_output_path
  }

  provisioner "local-exec" {
    command = "KUBECONFIG=${self.triggers.kubeconfig_output_path} minikube -p ${self.triggers.profile} start --driver=${self.triggers.driver} --cpus=${self.triggers.cpus} --memory=${self.triggers.memory} --container-runtime=containerd --ports=${self.triggers.nodeport}:${self.triggers.nodeport} --extra-config=apiserver.service-node-port-range=1-65535"
  }

  provisioner "local-exec" {
    when    = destroy
    command = "minikube -p ${self.triggers.profile} delete"
  }
}
