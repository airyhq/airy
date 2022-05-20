package configmaps

import (
	"context"
	"fmt"
	"strings"

	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

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

		componentsGroup, componentName, ok := getComponentFromLabel(label)
		if !ok {
			continue
		}

		componentsGroupContent, ok := components[componentsGroup]
		if !ok {
			componentsGroupContent = make(map[string]interface{})
			components[componentsGroup] = componentsGroupContent
		}

		componentsGroupContent[componentName] = valueTransformer(configmap.Data)
	}

	return components, nil
}

func getComponentFromLabel(l string) (string, string, bool) {
	c := strings.Split(l, "-")
	if len(c) != 2 {
		return "", "", false
	}

	return c[0], c[1], true
}
