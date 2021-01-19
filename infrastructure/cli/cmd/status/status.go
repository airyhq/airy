package status

import (
	"fmt"
	"os"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// StatusCmd reports the status of your Airy Core Platform
var StatusCmd = &cobra.Command{
	Use:   "status",
	Short: "Reports the status of your Airy Core Platform",
	Long:  ``,
	Run:   status,
}

func status(cmd *cobra.Command, args []string) {
	c := httpclient.NewClient(viper.GetString("apihost"))

	c.JWTToken = viper.GetString("apiJWTToken")

	res, err := c.Config()

	if err != nil {
		fmt.Println("could not read status: ", err)
		os.Exit(1)
	}

	fmt.Println(res.Components)
}
