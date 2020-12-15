package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var CLIVersion string
var GitCommit string

// StatusCmd cli kafka version
var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Return current version",
	Long:  ``,
	Run:   version,
}

func version(cmd *cobra.Command, args []string) {
	fmt.Printf("Version: %s, GitCommit: %s", CLIVersion, GitCommit)
}

func init() {
	RootCmd.AddCommand(versionCmd)
}
