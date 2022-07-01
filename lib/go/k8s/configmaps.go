package k8s

import (
	"context"
	"fmt"
	"strings"

	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func ApplyConfigMap(
	configmapName string,
	namespace string,
	data map[string]string,
	labels map[string]string,
	annotations map[string]string,
	clientset *kubernetes.Clientset,
) error {
	cm, _ := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configmapName, v1.GetOptions{})
	if cm.GetName() == "" {
		_, err := clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(),
			&corev1.ConfigMap{
				ObjectMeta: v1.ObjectMeta{
					Name:        configmapName,
					Namespace:   namespace,
					Labels:      labels,
					Annotations: annotations,
				},
				Data: data,
			}, v1.CreateOptions{})
		return err
	}

	if data != nil && len(data) > 0 {
		cm.Data = data
	}
	if cm.Labels == nil {
		cm.Labels = make(map[string]string)
	}
	for k, v := range labels {
		cm.Labels[k] = v
	}
	if cm.Annotations == nil {
		cm.Annotations = make(map[string]string)
	}
	for k, v := range annotations {
		cm.Annotations[k] = v
	}
	_, err := clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
	return err
}

func MergeConfigMap(
	configmapName string,
	namespace string,
	data map[string]string,
	clientset *kubernetes.Clientset,
) error {
	cm, _ := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configmapName, v1.GetOptions{})
	if cm.GetName() == "" {
		_, err := clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(),
			&corev1.ConfigMap{
				ObjectMeta: v1.ObjectMeta{
					Name:      configmapName,
					Namespace: namespace,
				},
				Data: data,
			}, v1.CreateOptions{})
		return err
	}

	if data != nil && len(data) > 0 {
		cm.Data = data
	}
	_, err := clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
	return err
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

func GetComponentsConfigMaps(
	ctx context.Context,
	namespace string,
	clientSet *kubernetes.Clientset,
	valueTransformer func(map[string]string) map[string]string,
) (map[string]map[string]interface{}, error) {
	configmapList, err := clientSet.CoreV1().ConfigMaps(namespace).List(ctx, v1.ListOptions{LabelSelector: "core.airy.co/component"})
	if err != nil {
		return nil, fmt.Errorf("Unable to list config maps. Error: %s\n", err)
	}

	components := make(map[string]map[string]interface{})
	for _, configmap := range configmapList.Items {
		label, ok := configmap.Labels["core.airy.co/component"]
		if !ok {
			continue
		}

		componentsGroup, componentName := getComponentFromLabel(label)

		componentsGroupContent, ok := components[componentsGroup]
		if !ok {
			componentsGroupContent = make(map[string]interface{})
			components[componentsGroup] = componentsGroupContent
		}

		componentsGroupContent[componentName] = valueTransformer(configmap.Data)
	}

	return components, nil
}

func getComponentFromLabel(l string) (string, string) {
	c := strings.Split(l, "-")

	return c[0], strings.Join(c[1:], "-")
}
