package cmd

import (
	"fmt"
	"os"
	"path"

	"cli/cmd/auth"
	"cli/cmd/config"
	"cli/cmd/ui"

	homedir "github.com/mitchellh/go-homedir"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

const configFileName = ".airycli"

var configFile string
var Version string
var CommitSHA1 string

// RootCmd represents the base command when called without any subcommands
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

// Version command
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Prints version information",
	Long:  ``,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("Version: %s, GitCommit: %s", Version, CommitSHA1)
	},
}

// Version command
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

		//TODO let users choose a different name
		viper.AddConfigPath(home)
		viper.SetConfigName(configFileName)

		viper.WriteConfigAs(path.Join(home, configFileName))
	},
}

// Execute adds all child commands to the root command and sets flags
// appropriately. This is called by main.main(). It only needs to happen once to
// the rootCmd.
func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}

func initConfig() {
	if configFile != "" {
		viper.SetConfigFile(configFile)
	} else {
		home, err := homedir.Dir()
		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}

		viper.AddConfigPath(home)
		viper.SetConfigName(configFileName)
	}

	viper.AutomaticEnv()

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

	rootCmd.PersistentFlags().StringVar(&configFile, "config", "", "config file (default is $HOME/.airycli.yaml)")
	rootCmd.AddCommand(auth.AuthCmd)
	rootCmd.AddCommand(config.ConfigCmd)
	rootCmd.AddCommand(ui.UICmd)
	rootCmd.AddCommand(versionCmd)
	rootCmd.AddCommand(initCmd)
}
