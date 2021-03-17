package api

import (
	"cli/pkg/kube"
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var endpointCmd = &cobra.Command{
	Use:   "endpoint",
	Short: "Get the endpoint of the Airy Core API",
	Long:  ``,
	Run:   endpoint,
}

func endpoint(cmd *cobra.Command, args []string) {
	kubeCtx := kube.Load()
	set, err := kubeCtx.GetClientSet()
	if err != nil {
		fmt.Println("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	hosts, err := kube.GetHosts(set, viper.GetString("namespace"))
	if err != nil {
		fmt.Println("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	fmt.Println(hosts["HOST"])
}
