package config

import (
	"fmt"
	"os"
	"path"

	"github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
)

var kubeConfigFile string
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

	if twilioApply(conf, kubeConfigFile) {
		fmt.Println("Twilio configuration applied.")
	}

	if facebookApply(conf, kubeConfigFile) {
		fmt.Println("Facebook configuration applied.")
	}

	if googleApply(conf, kubeConfigFile) {
		fmt.Println("Google configuration applied.")
	}

	if webhooksApply(conf, kubeConfigFile) {
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
	ConfigCmd.PersistentFlags().StringVar(&kubeConfigFile, "kube-config", "", "Kubernetes config file for the cluster of an Airy Core instance (default \"~/.kube/config\")")
	ConfigCmd.PersistentFlags().StringVar(&configFile, "config", "./airy.yaml", "Configuration file for an Airy Core instance")
	if kubeConfigFile == "" {
		home, err := homedir.Dir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		kubeConfigFile = path.Join(home, ".kube/config")
	}
	ConfigCmd.AddCommand(applyConfigCmd)
}
