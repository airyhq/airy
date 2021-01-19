package api

import (
	"github.com/spf13/cobra"
)

// APICmd subcommand for Airy Core
var APICmd = &cobra.Command{
	Use:              "api",
	TraverseChildren: true,
	Short:            "Interacts with the Airy Core Platform HTTP API",
	Long:             ``,
}

func init() {
	APICmd.AddCommand(SignupCmd)
	APICmd.AddCommand(loginCmd)
}
