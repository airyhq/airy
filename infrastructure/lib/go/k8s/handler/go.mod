module github.com/airyhq/airy/infrastructure/lib/go/k8s/handler

go 1.16

require (
	github.com/airyhq/airy/infrastructure/lib/go/k8s/util v0.0.0
	golang.org/x/time v0.0.0-20201208040808-7e3f01d25324 // indirect
	k8s.io/api v0.19.0
	k8s.io/apimachinery v0.19.0
	k8s.io/client-go v0.19.0
	k8s.io/klog v1.0.0
	k8s.io/utils v0.0.0-20201110183641-67b214c5f920 // indirect
)

replace github.com/airyhq/airy/infrastructure/lib/go/k8s/util => ../util
