module "my-airy-core" {
  source  = "../modules/core"
  values_yaml = data.template_file.values_yaml.rendered
}

data "template_file" "values_yaml" {
  template = file("${path.module}/files/values.yaml")

  vars = {
    host        = var.host
    hosted_zone = var.hosted_zone
  }
}
