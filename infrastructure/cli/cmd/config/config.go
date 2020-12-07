package config

import (
	"fmt"

	"github.com/spf13/cobra"
)

// ResponsePayload for receiving the request

// ConfigCmd subcommand for Airy Core
var ConfigCmd = &cobra.Command{
	Use:              "config",
	TraverseChildren: true,
	Short:            "Reloads configuration based on airy.conf",
	Long:             ``,
	Run:              config,
}

func config(cmd *cobra.Command, args []string) {
	// Initialize the api request

	fmt.Println("Applied configutation")

}

func init() {
	var appname string
	ConfigCmd.Flags().StringVarP(&appname, "app-name", "a", "", "The app which we will reset.")
}
