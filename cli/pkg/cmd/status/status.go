package status

import (
	"cli/pkg/console"
	"context"
	"fmt"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"os"
	"text/tabwriter"

	"cli/pkg/kube"
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
	c := httpclient.NewClient(viper.GetString("apihost"))

	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()

	if err != nil {
		console.Exit("Could not get kubernetes client", err)
	}
	cm, _ := clientset.CoreV1().ConfigMaps(viper.GetString("namespace")).Get(context.TODO(), "api-config", v1.GetOptions{})

	c.Token = cm.Data["SYSTEM_TOKEN"]

	res, err := c.Config()

	if err != nil {
		console.Exit("could not read status: ", err)
	}

	w := tabwriter.NewWriter(os.Stdout, 1, 1, 1, ' ', 0)

	for k, v := range res.Components {
		if v["enabled"].(bool) {
			fmt.Fprintf(w, "%s\t\u2713\n", k)
		} else {
			fmt.Fprintf(w, "%s\t\u2717\n", k)
		}
	}

	w.Flush()
}
