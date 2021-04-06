package config

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"fmt"
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
	cfgDir, err := cmd.Flags().GetString("config-dir")
	if err != nil {
		console.Exit(err)
	}
	dir := workspace.Init(cfgDir)

	conf, err := parseConf(dir.GetAiryYaml())
	if err != nil {
		console.Exit("error parsing configuration file: ", err)
	}
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	if err != nil {
		console.Exit("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	if twilioApply(conf, clientset) {
		fmt.Println("Twilio configuration applied.")
	}

	if facebookApply(conf, clientset) {
		fmt.Println("Facebook configuration applied.")
	}

	if googleApply(conf, clientset) {
		fmt.Println("Google configuration applied.")
	}

	if webhooksApply(conf, clientset) {
		fmt.Println("Webhooks configuration applied.")
	}
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
