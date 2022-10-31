package gcp

import _ "embed"

//go:embed kubeConfigTemplate.yaml
var KubeConfigTemplate string
