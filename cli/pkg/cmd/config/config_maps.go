package config

import (
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"cli/pkg/console"
	"fmt"
	"context"
	"bytes"

	"k8s.io/client-go/kubernetes"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"

)

func syncConfigMaps(ws workspace.ConfigDir, clientset *kubernetes.Clientset) {
	conf, err := ws.LoadAiryYaml()
	if err != nil {
		console.Exit("error parsing configuration file: ", err)
	}

	secData := getSecurityData(conf.Security)
	if len(secData) != 0 {
		applyErr := kube.ApplyConfigMap("security", conf.Kubernetes.Namespace, secData, map[string]string{}, clientset)
		if applyErr != nil {
			// TODO should we error here?
			fmt.Printf("unable to apply configuration for \"security\"\n Error:\n %v\n", applyErr)
		} else {
			fmt.Printf("applied configuration for \"security\"\n")
		}
	}
	
	configuredComponents := make(map[string]bool)
	for componentType, _ := range conf.Components {
		for componentName, componentValues := range conf.Components[componentType] {
			configmapName := componentType + "-" + componentName
			labels := map[string]string{
				"core.airy.co/component": configmapName,
			}
			applyErr := kube.ApplyConfigMap(configmapName, conf.Kubernetes.Namespace, componentValues, labels, clientset)
			configuredComponents[configmapName] = true
			if applyErr != nil {
				fmt.Printf("unable to apply configuration for component: \"%s-%s\"\n Error:\n %v\n", componentType, componentName, applyErr)
			} else {
				fmt.Printf("applied configuration for component: \"%s-%s\"\n", componentType, componentName)
			}
		}
	}

	configmapList, _ := clientset.CoreV1().ConfigMaps(conf.Kubernetes.Namespace).List(context.TODO(), v1.ListOptions{LabelSelector: "core.airy.co/component"})
	for _, configmap := range configmapList.Items {
		if !configuredComponents[configmap.ObjectMeta.Name] {
			deleteErr := kube.DeleteConfigMap(configmap.ObjectMeta.Name, conf.Kubernetes.Namespace, clientset)
			if deleteErr != nil {
				fmt.Printf("unable to remove configuration for component %s.\n", configmap.ObjectMeta.Name)
			} else {
				fmt.Printf("removed configuration for component \"%s\".\n", configmap.ObjectMeta.Name)
			}
		}
	}



	if connectComponent, ok := conf.Components["integration"]["connect"]; ok {
		connectorDir := connectComponent["connectorsDir"]

		connectors, err := ws.GetConnectorConfigs(connectorDir)
		if err != nil {
			fmt.Println(err)
		}

		for _, c := range connectors {
			cMap := make(map[string]string)
			cMap["name"] = c.Name
			cMap["config"] = createKeyValuePairs(c.Config)
			labels := map[string]string{
				"core.airy.co/connector": c.Name,
			}
			applyErr := kube.ApplyConfigMap("connector-" + c.Name, conf.Kubernetes.Namespace, c.Config, labels, clientset)
			if applyErr != nil {
				fmt.Println("Could not apply connectors")
			}
		}

	}
}

func getSecurityData(s workspace.SecurityConf) map[string]string {
	m := make(map[string]string, len(s.Oidc))

	if s.SystemToken != "" {
		m["systemToken"] = s.SystemToken
	}
	if s.AllowedOrigins != "" {
		m["allowedOrigins"] = s.AllowedOrigins
	}
	if s.JwtSecret != "" {
		m["jwtSecret"] = s.JwtSecret
	}

	for key, value := range s.Oidc {
		if value != "" {
			m["oidc." + key] = value
		}
	}

	return m
}

func createKeyValuePairs(m map[string]string) string {
    b := new(bytes.Buffer)
    for key, value := range m {
        fmt.Fprintf(b, "%s=\"%s\"\n", key, value)
    }
    return b.String()
}