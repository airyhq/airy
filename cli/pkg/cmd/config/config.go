package config

import (
	"cli/pkg/console"
	"cli/pkg/workspace"
	"fmt"
	"os"
	"text/tabwriter"

	"github.com/airyhq/airy/lib/go/httpclient"
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
	systemToken := viper.GetString("systemToken")
	c := httpclient.NewClient(viper.GetString("apihost"))
	c.Token = systemToken

	res, err := c.ComponentsGet()
	if err != nil {
		console.Exit("could not get config: ", err)
	}
	blob, err := yaml.Marshal(map[string]interface{}{"components": res})
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

	resComponents, err := c.ComponentsUpdate(conf)
	if err != nil {
		console.Exit("could not apply components config: ", err)
	}
	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)
	fmt.Fprintf(w, "Component\t\t\tApplied\n")
	for component, applied := range resComponents.Components {
		fmt.Fprintf(w, "%s\t\t\t%t\n", component, applied)
	}
	w.Flush()

	resCluster, err := c.ClusterUpdate(conf)
	if err != nil {
		console.Exit("could not apply cluster config: ", err)
	}
	w = tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)
	fmt.Fprintf(w, "\n")
	fmt.Fprintf(w, "Cluster config\t\t\tApplied\n")
	for clusterConfig, applied := range resCluster.ClusterConfig {
		fmt.Fprintf(w, "%s\t\t\t%t\n", clusterConfig, applied)
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
