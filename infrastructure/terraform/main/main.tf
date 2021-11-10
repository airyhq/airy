module "my-airy-core" {
  source  = "../modules/core"
  values_yaml = data.template_file.airy_yaml.rendered
}

data "template_file" "airy_yaml" {
  template = file("${path.module}/files/airy.yaml")

  vars = {
    host        = var.host
    hosted_zone = var.hosted_zone
  }
}
