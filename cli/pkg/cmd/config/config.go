package config

import (
	"cli/pkg/console"
	"cli/pkg/workspace"
	"context"
	"fmt"
	"os"
	"text/tabwriter"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/airyhq/airy/lib/go/kubectl/configmaps"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v2"
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
	systemToken := viper.GetString("systemToken")
	conf, err := dir.LoadAiryYaml()
	if err != nil {
		console.Exit("error parsing configuration file: ", err)
	}
	c := httpclient.NewClient(viper.GetString("apihost"))

	c.Token = systemToken

	res, err := c.ComponentsUpdate(conf)

	if err != nil {
		console.Exit("could not apply config: ", err)
	}

	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)
	fmt.Fprintf(w, "Configured component\t\tEnabled\n")

	for _, component := range res {
		fmt.Fprintf(w, "%s\t\t%t\n", component.Name, component.Enabled)
	}

	w.Flush()

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
