package cmd

import (
	"fmt"
	"os"
	"path"

	"cli/cmd/api"
	"cli/cmd/config"
	"cli/cmd/status"
	"cli/cmd/ui"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const cliConfigFileName = "cli.yaml"
const cliConfigDirName = ".airy"

var cliConfigFile string
var Version string
var CommitSHA1 string

var rootCmd = &cobra.Command{
	Use:              "airy",
	Short:            "airy controls your Airy Core Platform instance",
	Long:             ``,
	TraverseChildren: true,
	PersistentPreRun: func(cmd *cobra.Command, args []string) {
		if cmd.Name() != "init" {
			initConfig()
		}
	},
}

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Prints version information",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Version: %s, GitCommit: %s", Version, CommitSHA1)
	},
}

var initCmd = &cobra.Command{
	Use:   "init",
	Short: "Inits your Airy CLI configuration",
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
	if err := rootCmd.Execute(); err != nil {
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
	rootCmd.PersistentFlags().StringVar(&apiHost, "apihost", "http://api.airy", "Airy Core Platform HTTP API host")
	viper.BindPFlag("apihost", rootCmd.PersistentFlags().Lookup("apihost"))
	viper.SetDefault("apihost", "http://api.airy")

	apiJWTToken := ""
	rootCmd.PersistentFlags().StringVarP(&apiJWTToken, "apiJWTToken", "", "", "apiJWTToken")
	rootCmd.PersistentFlags().MarkHidden("apiJWTToken")
	viper.BindPFlag("apiJWTToken", rootCmd.PersistentFlags().Lookup("apiJWTToken"))
	rootCmd.PersistentFlags().StringVar(&cliConfigFile, "cli-config", "", "config file (default is $HOME/.airy/cli.yaml)")
	rootCmd.AddCommand(api.APICmd)
	rootCmd.AddCommand(config.ConfigCmd)
	rootCmd.AddCommand(status.StatusCmd)
	rootCmd.AddCommand(ui.UICmd)
	rootCmd.AddCommand(versionCmd)
	rootCmd.AddCommand(initCmd)
}
