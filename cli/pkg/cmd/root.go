package cmd

import (
	"cli/pkg/cmd/api"
	"cli/pkg/cmd/config"
	"cli/pkg/cmd/create"
	"cli/pkg/cmd/status"
	"cli/pkg/cmd/ui"
	"cli/pkg/cmd/upgrade"
	"cli/pkg/kube"
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
			workspace.Init(cliConfigDir, true)
		}
	},
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Prints version information",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("CLI version: %s, GitCommit: %s\n", Version, CommitSHA1)

		wsPath, _ := cmd.Flags().GetString("workspace")
		dir := workspace.Init(wsPath, false) // Will exit if command is invoked outside of a workspace
		dir.LoadAiryYaml()
		kubeCtx := kube.Load()
		set, err := kubeCtx.GetClientSet()
		if err != nil {
			return
		}

		coreConfig, err := kube.GetCmData("core-config", viper.GetString("namespace"), set)
		if err != nil {
			fmt.Println("Warning: Unable to retrieve the version of the Airy Core instance.")
		} else {
			fmt.Println("Airy instance version: ", coreConfig["APP_IMAGE_TAG"])
		}
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

	RootCmd.PersistentFlags().StringVar(&cliConfigDir, "workspace", "", "workspace directory of an Airy core instance (default is the cwd)")
	RootCmd.AddCommand(api.APICmd)
	RootCmd.AddCommand(config.ConfigCmd)
	RootCmd.AddCommand(status.StatusCmd)
	RootCmd.AddCommand(ui.UICmd)
	RootCmd.AddCommand(versionCmd)
	RootCmd.AddCommand(create.CreateCmd)
	RootCmd.AddCommand(upgrade.UpgradeCmd)
}
