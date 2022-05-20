package config

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"context"
	"fmt"
	"os"

	"github.com/airyhq/airy/lib/go/kubectl/configmaps"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v2"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

var configFile string

// ConfigCmd subcommand for Airy Core
var ConfigCmd = &cobra.Command{
	Use:              "config",
	TraverseChildren: true,
	Short:            "Manages an Airy Core instance via airy.yaml",
	Run:              getConfig,
}

func getConfig(cmd *cobra.Command, args []string) {
	namespace := viper.GetString("namespace")
	kubeCtx := kube.Load()
	clientSet, err := kubeCtx.GetClientSet()
	if err != nil {
		fmt.Printf(err.Error())
		console.Exit("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	identity := func(d map[string]string) map[string]string { return d }

	components, err := configmaps.GetComponentsConfigMaps(context.Background(), namespace, clientSet, identity)
	if err != nil {
		console.Exit(err.Error())
	}

	blob, err := yaml.Marshal(map[string]interface{}{"components": components})
	if err != nil {
		console.Exit("could not marshal components list %s", err)
	}

	fmt.Println(string(blob))
}

func applyConfig(cmd *cobra.Command, args []string) {
	workspacePath, err := cmd.Flags().GetString("workspace")
	if err != nil {
		console.Exit(err)
	}
	ApplyConfig(workspacePath)
}

func ApplyConfig(workspacePath string) {
	dir, err := workspace.Init(workspacePath)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	namespace := viper.GetString("namespace")
	conf, err := dir.LoadAiryYaml()
	if err != nil {
		console.Exit("error parsing configuration file: ", err)
	}
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	if err != nil {
		console.Exit("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	secData := getSecurityData(conf.Security)
	if len(secData) != 0 {
		applyErr := kube.ApplyConfigMap("security", namespace, secData, map[string]string{}, clientset)
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
			applyErr := kube.ApplyConfigMap(configmapName, namespace, componentValues, labels, clientset)
			configuredComponents[configmapName] = true
			if applyErr != nil {
				fmt.Printf("unable to apply configuration for component: \"%s-%s\"\n Error:\n %v\n", componentType, componentName, applyErr)
			} else {
				fmt.Printf("applied configuration for component: \"%s-%s\"\n", componentType, componentName)
			}
		}
	}

	configmapList, _ := clientset.CoreV1().ConfigMaps(namespace).List(context.TODO(), v1.ListOptions{LabelSelector: "core.airy.co/component"})
	for _, configmap := range configmapList.Items {
		if !configuredComponents[configmap.ObjectMeta.Name] {
			deleteErr := kube.DeleteConfigMap(configmap.ObjectMeta.Name, namespace, clientset)
			if deleteErr != nil {
				fmt.Printf("unable to remove configuration for component %s.\n", configmap.ObjectMeta.Name)
			} else {
				fmt.Printf("removed configuration for component \"%s\".\n", configmap.ObjectMeta.Name)
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
			m["oidc."+key] = value
		}
	}

	return m
}

var applyConfigCmd = &cobra.Command{
	Use:              "apply",
	TraverseChildren: true,
	Short:            "Applies configuration values from airy.yaml configuration to an Airy Core instance",
	Run:              applyConfig,
}

func init() {
	ConfigCmd.AddCommand(applyConfigCmd)
}
