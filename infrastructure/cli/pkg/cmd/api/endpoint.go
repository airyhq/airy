package api

import (
	"cli/pkg/core"
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var endpointCmd = &cobra.Command{
	Use:   "endpoint",
	Short: "Get the endpoint of the Airy Core API",
	Long:  ``,
	Run:   endpoint,
}

func endpoint(cmd *cobra.Command, args []string) {
	hosts := core.LoadHostsFromConfig()
	url := hosts.Api.Url
	if url == "" {
		fmt.Println("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	fmt.Println(url)
}
