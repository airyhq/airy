package k8s

import (
	"context"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func ApplyConfigMap(configmapName string, namespace string, cmData map[string]string, labels map[string]string, clientset *kubernetes.Clientset) error {
	cm, _ := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configmapName, v1.GetOptions{})
	if cm.GetName() == "" {
		_, err := clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(),
			&corev1.ConfigMap{
				ObjectMeta: v1.ObjectMeta{
					Name:      configmapName,
					Namespace: namespace,
					Labels:    labels,
				},
				Data: cmData,
			}, v1.CreateOptions{})
		return err
	} else {
		cm.Data = cmData
		_, err := clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
		return err
	}
}

func DeleteConfigMap(configmapName string, namespace string, clientset *kubernetes.Clientset) error {
	cm, _ := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configmapName, v1.GetOptions{})
	if cm.GetName() != "" {
		err := clientset.CoreV1().ConfigMaps(namespace).Delete(context.TODO(), configmapName, v1.DeleteOptions{})
		return err
	}
	return nil
}

func GetCmData(configmapName string, namespace string, clientset *kubernetes.Clientset) (map[string]string, error) {
	configMaps := clientset.CoreV1().ConfigMaps(namespace)

	configMap, err := configMaps.Get(context.TODO(), configmapName, metav1.GetOptions{})
	if err != nil {
		return nil, err
	}

	return configMap.Data, nil
}
