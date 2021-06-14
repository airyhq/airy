package config

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"

	"github.com/spf13/cobra"
)

var configFile string

// ConfigCmd subcommand for Airy Core
var ConfigCmd = &cobra.Command{
	Use:              "config",
	TraverseChildren: true,
	Short:            "Manages an Airy Core instance via airy.yaml",
}

func applyConfig(cmd *cobra.Command, args []string) {
	cfgDir, err := cmd.Flags().GetString("workspace")
	if err != nil {
		console.Exit(err)
	}

	
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	if err != nil {
		console.Exit("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	ws := workspace.Init((cfgDir))

	syncConfigMaps(ws, clientset)

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
