package cmd

import (
	"fmt"
	"os"
	"path"

	"cli/pkg/cmd/api"
	"cli/pkg/cmd/config"
	"cli/pkg/cmd/create"
	"cli/pkg/cmd/status"
	"cli/pkg/cmd/ui"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const cliConfigFileName = "cli.yaml"
const cliConfigDirName = ".airy"

var cliConfigFile string
var Version string
var CommitSHA1 string

var RootCmd = &cobra.Command{
	Use:              "airy",
	Short:            "airy controls an Airy Core instance",
	Long:             ``,
	TraverseChildren: true,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if cmd.Name() != "init" && cmd.Name() != "version" {
			initConfig()
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

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Inits your airy configuration",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		home, err := homedir.Dir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		configDirPath := path.Join(home, cliConfigDirName)

		if _, errConfigDir := os.Stat(configDirPath); os.IsNotExist(errConfigDir) {
			errDir := os.MkdirAll(configDirPath, 0700)
			if errDir != nil {
				fmt.Println(errDir)
				os.Exit(1)
			}
		}

		err = viper.WriteConfigAs(path.Join(home, cliConfigDirName, cliConfigFileName))
		if err != nil {
			fmt.Println("cannot write config: ", err)
		}
	},
}

func Execute() {
	if err := RootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func initConfig() {
	if cliConfigFile != "" {
		viper.SetConfigFile(cliConfigFile)
	} else {
		home, err := homedir.Dir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		viper.AddConfigPath(path.Join(home, cliConfigDirName))
		viper.SetConfigType("yaml")
		viper.SetConfigName(cliConfigFileName)
	}

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			fmt.Println(err)
			fmt.Println("please run airy init")
		} else {
			fmt.Println("invalid configuration: ", err)
		}

		os.Exit(1)
	}
}

func init() {
	apiHost := ""
	RootCmd.PersistentFlags().StringVar(&apiHost, "apihost", "http://airy.core", "Airy Core HTTP API host")
	viper.BindPFlag("apihost", RootCmd.PersistentFlags().Lookup("apihost"))
	viper.SetDefault("apihost", "http://airy.core")

	apiJWTToken := ""
	RootCmd.PersistentFlags().StringVarP(&apiJWTToken, "apiJWTToken", "", "", "apiJWTToken")
	RootCmd.PersistentFlags().MarkHidden("apiJWTToken")
	viper.BindPFlag("apiJWTToken", RootCmd.PersistentFlags().Lookup("apiJWTToken"))
	RootCmd.PersistentFlags().StringVar(&cliConfigFile, "cli-config", "", "config file (default is $HOME/.airy/cli.yaml)")
	RootCmd.AddCommand(api.APICmd)
	RootCmd.AddCommand(config.ConfigCmd)
	RootCmd.AddCommand(status.StatusCmd)
	RootCmd.AddCommand(ui.UICmd)
	RootCmd.AddCommand(versionCmd)
	RootCmd.AddCommand(initCmd)
	RootCmd.AddCommand(create.CreateCmd)
}
