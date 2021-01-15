package config

import (
	"fmt"

	"github.com/spf13/cobra"
)

// ConfigCmd subcommand for Airy Core
var ConfigCmd = &cobra.Command{
	Use:              "config",
	TraverseChildren: true,
	Short:            "Reloads configuration based on airy.yaml",
	Long:             ``,
	Run:              config,
}

func config(cmd *cobra.Command, args []string) {
	fmt.Println("ConfigCmd called")

}
