package cmd

import (
	"fmt"
	"os"

	"cli/cmd/auth"
	"cli/cmd/bootstrap"
	"cli/cmd/config"
	"cli/cmd/demo"

	"github.com/spf13/cobra"
)

// rootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:              "airy",
	Short:            "Airy CLI",
	Long:             ``,
	TraverseChildren: true,
}

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {

	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

}

func init() {
	RootCmd.AddCommand(bootstrap.BootstrapCmd)
	RootCmd.AddCommand(auth.AuthCmd)
	RootCmd.AddCommand(config.ConfigCmd)
	RootCmd.AddCommand(demo.DemoCmd)
}
