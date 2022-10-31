package gcp

import _ "embed"

//go:embed rolepolicy.json
// var RolePolicyDocument string

//go:embed kubeConfigTemplate.yaml
var KubeConfigTemplate string
