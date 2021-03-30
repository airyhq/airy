package kube

import (
	"context"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func GetHosts(clientset *kubernetes.Clientset, namespace string) (map[string]string, error) {
	configMaps := clientset.CoreV1().ConfigMaps(namespace)

	configMap, err := configMaps.Get(context.TODO(), "hostnames", metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return configMap.Data, nil
}

