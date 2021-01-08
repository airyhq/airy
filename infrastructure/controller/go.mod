module github.com/airyhq/airy/infrastructure/controller

go 1.15

require (
	github.com/airyhq/airy/infrastructure/lib/go/k8s/handler v0.0.0
	github.com/airyhq/airy/infrastructure/lib/go/k8s/util v0.0.0
	k8s.io/api v0.20.0
	k8s.io/apimachinery v0.20.0
	k8s.io/client-go v0.20.0
	k8s.io/klog v1.0.0
)

replace github.com/airyhq/airy/infrastructure/lib/go/k8s/handler => ../lib/go/k8s/handler
replace github.com/airyhq/airy/infrastructure/lib/go/k8s/util => ../lib/go/k8s/util