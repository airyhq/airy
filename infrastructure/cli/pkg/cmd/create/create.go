package create

import (
	"cli/pkg/providers"
	"fmt"
	"github.com/spf13/cobra"
	"os"
)

var (
	provider  string
	namespace string
	version   string
	CreateCmd = &cobra.Command{
		Use:   "create",
		Short: "Creates an instance of Airy Core",
		Long:  ``,
		Run:   create,
	}
)

func init() {
	CreateCmd.Flags().StringVar(&provider, "provider", "local", "One of the supported providers (aws|local|minikube).")
	CreateCmd.Flags().StringVar(&namespace, "namespace", "default", "(optional) Kubernetes namespace that Airy should be installed to.")
	CreateCmd.MarkFlagRequired("provider")

}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", provider)

	provider, err := providers.GetProvider(providers.ProviderName(provider))
	if err != nil {
		fmt.Println("could not get provider: ", err)
		os.Exit(1)
	}

	context, err := provider.Provision()
	if err != nil {
		fmt.Println("could not provision cluster: ", err)
		os.Exit(1)
	}

	clientset, err := context.GetClientSet()
	if err != nil {
		fmt.Println("could not get clientset: ", err)
		os.Exit(1)
	}

	helm := New(clientset, version, namespace)
	if err := helm.Setup(); err != nil {
		fmt.Println("setting up Helm failed with err: ", err)
		os.Exit(1)
	}
	if err := helm.InstallCharts(); err != nil {
		fmt.Println("installing Helm charts failed with err: ", err)
		os.Exit(1)
	}

	fmt.Println("🚀 Starting core with default components")
	fmt.Println("🎉 Your Airy Core is ready")
	fmt.Println("\t Link to the API")
	fmt.Println("\t Link to the UI")
	fmt.Println("\t Link to more docs")
}
