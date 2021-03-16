package api

import (
	"fmt"

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
	endpoint := viper.Get("apihost")
	fmt.Println(endpoint)
}
