package deploy

import (
	"cli/pkg/console"
	"cli/pkg/providers"
	"fmt"

	"github.com/TwinProduction/go-color"
	"github.com/spf13/cobra"
	"gopkg.in/segmentio/analytics-go.v3"
)

var (
	image      string
	deployment string
	DeployCmd  = &cobra.Command{
		Use:   "deploy",
		Short: "Deploys a local image on a deployment of Airy Core",
		Long:  `Deploys an image from the local docker registry to a deployment on a minikube Airy Core instance.`,
		Args:  cobra.MaximumNArgs(2),
		Run:   deploy,
	}
)

func init() {
	DeployCmd.Flags().StringVar(&image, "image", "", "Name and tag of the local image.")
	DeployCmd.Flags().StringVar(&deployment, "deployment", "", "Name of the deployment in the Airy Core cluster that is to be replaced.")
}

func deploy(cmd *cobra.Command, args []string) {
	if image == "" || deployment == "" {
		console.Exit("Please provide both an image and deployment name.")
	}

	w := console.GetMiddleware(func(input string) string {
		return color.Colorize(color.Cyan, "#\t"+input)
	})
	airyAnalytics := console.NewAiryAnalytics(false)
	airyAnalytics.Track(analytics.Track{
		AnonymousId: "AiryUser",
		Event:       "deploy_called",
	})
	provider := providers.MustGet(providers.ProviderName("minikube"), w, airyAnalytics)
	out, err := provider.UpdateDeployment(image, deployment)
	if err != nil {
		console.Exit("Unable to load the image into minikube: ", err.Error())
	}
	fmt.Println(out)
}
