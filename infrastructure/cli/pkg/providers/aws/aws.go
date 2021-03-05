package aws

import (
	"fmt"
	"k8s.io/client-go/kubernetes"
	"os"
)


func Create() (*kubernetes.Clientset, error) {
	fmt.Println("aws provider not yet implemented")
	os.Exit(1)
	return nil, nil
}
