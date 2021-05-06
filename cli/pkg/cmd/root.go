package cmd

import (
	"cli/pkg/cmd/api"
	"cli/pkg/cmd/config"
	"cli/pkg/cmd/create"
	"cli/pkg/cmd/status"
	"cli/pkg/cmd/ui"
	"cli/pkg/workspace"
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const cliConfigFileName = "cli.yaml"
const cliConfigDirName = ".airy"

var cliConfigDir string
var Version string
var CommitSHA1 string

var RootCmd = &cobra.Command{
	Use:              "airy",
	Short:            "airy controls an Airy Core instance",
	Long:             ``,
	TraverseChildren: true,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if cmd.Name() != "create" && cmd.Name() != "version" {
			workspace.Init(cliConfigDir)
		}
	},
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Prints version information",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Version: %s, GitCommit: %s\n", Version, CommitSHA1)
	},
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func init() {
	apihost := ""
	RootCmd.PersistentFlags().StringVar(&apihost, "apihost", "", "Airy Core HTTP API endpoint")
	viper.BindPFlag("apihost", RootCmd.PersistentFlags().Lookup("apihost"))
	viper.SetDefault("apihost", "http://airy.core")

	RootCmd.PersistentFlags().StringVar(&cliConfigDir, "config-dir", "", "config directory of an airy core instance (default is the cwd)")
	RootCmd.AddCommand(api.APICmd)
	RootCmd.AddCommand(config.ConfigCmd)
	RootCmd.AddCommand(status.StatusCmd)
	RootCmd.AddCommand(ui.UICmd)
	RootCmd.AddCommand(versionCmd)
	RootCmd.AddCommand(create.CreateCmd)
}
