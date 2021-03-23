package handler

import (
	"context"
	v1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func ConfigMapExists(name string, clientSet kubernetes.Interface, namespace string) bool {
	configMap, err := GetConfigMap(name, clientSet, namespace)
	return configMap != nil && err == nil
}

func GetConfigMap(name string, clientSet kubernetes.Interface, namespace string) (*v1.ConfigMap, error) {
	return clientSet.CoreV1().ConfigMaps(namespace).Get(context.TODO(), name, metav1.GetOptions{})
}
