package api

import (
	"cli/pkg/kube"
	"fmt"
	"os"

	"github.com/airyhq/airy/lib/go/k8s"
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

	coreConfig, err := k8s.GetCmData("core-config", viper.GetString("namespace"), set)
	if err != nil {
		fmt.Println("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	fmt.Println(coreConfig["API_HOST"])
}
