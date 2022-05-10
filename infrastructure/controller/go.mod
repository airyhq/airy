module github.com/airyhq/airy/infrastructure/controller

go 1.16

require (
	github.com/airyhq/airy/infrastructure/lib/go/k8s/handler v0.0.0
	github.com/airyhq/airy/infrastructure/lib/go/k8s/util v0.0.0
	github.com/golang-jwt/jwt v3.2.2+incompatible // indirect
	github.com/gorilla/mux v1.8.0 // indirect
	k8s.io/api v0.19.0
	k8s.io/apimachinery v0.19.0
	k8s.io/client-go v0.19.0
	k8s.io/klog v1.0.0
)

replace github.com/airyhq/airy/infrastructure/lib/go/k8s/handler => ../lib/go/k8s/handler

replace github.com/airyhq/airy/infrastructure/lib/go/k8s/util => ../lib/go/k8s/util
