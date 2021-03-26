package config

import (
	"cli/pkg/kube"
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var configFile string

// ConfigCmd subcommand for Airy Core
var ConfigCmd = &cobra.Command{
	Use:              "config",
	TraverseChildren: true,
	Short:            "Manages an Airy Core instance via airy.yaml",
}

func applyConfig(cmd *cobra.Command, args []string) {
	conf, err := parseConf(configFile)
	if err != nil {
		fmt.Println("error parsing configuration file: ", err)
		os.Exit(1)
	}
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	if err != nil {
		fmt.Println("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
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
	ConfigCmd.PersistentFlags().StringVar(&configFile, "config", "./airy.yaml", "Configuration file for an Airy Core instance")
	ConfigCmd.AddCommand(applyConfigCmd)
}
