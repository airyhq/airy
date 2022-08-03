package status

import (
	"cli/pkg/console"
	"fmt"
	"os"
	"text/tabwriter"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

// StatusCmd reports the status of an Airy Core instance
var StatusCmd = &cobra.Command{
	Use:   "status",
	Short: "Reports the status of an Airy Core instance",
	Long:  ``,
	Run:   status,
}

func status(cmd *cobra.Command, args []string) {
	c := httpclient.NewClient(viper.GetString("apihost"), viper.GetString("authToken"))

	res, err := c.Config()

	if err != nil {
		console.Exit("could not read status: ", err)
	}

	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)
	fmt.Fprintf(w, "service\tenabled\thealthy\n")

	for serviceName, service := range res.Services {
		enabledStr := "❌"
		if service.Enabled {
			enabledStr = "✅"
		}
		healthyStr := "❌"
		if service.Healthy {
			healthyStr = "✅"
		}

		fmt.Fprintf(w, "%s\t%s\t%s\n", serviceName, enabledStr, healthyStr)
	}

	w.Flush()
}
