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
	Short:            "Reloads configuration based on airy.yaml",
	Long:             `Reloads configuration based on airy.yaml`,
	Run:              config,
}

func config(cmd *cobra.Command, args []string) {
	fmt.Println("config called")
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
}

var applyConfigCmd = &cobra.Command{
	Use:              "apply",
	TraverseChildren: true,
	Short:            "Applies configuration based on airy.yaml",
	Long:             `Applies configuration based on airy.yaml`,
	Run:              applyConfig,
}

func init() {
	ConfigCmd.PersistentFlags().StringVar(&kubeConfigFile, "kube-config", "", "Kubernetes config file for the cluster where Airy is running (default \"~/.airy/kube.conf\")")
	ConfigCmd.PersistentFlags().StringVar(&configFile, "config", "../airy.yaml", "Configuration file for the Airy platform")
	if kubeConfigFile == "" {
		home, err := homedir.Dir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		kubeConfigFile = path.Join(home, ".airy/kube.conf")
	}
	ConfigCmd.AddCommand(applyConfigCmd)
}
