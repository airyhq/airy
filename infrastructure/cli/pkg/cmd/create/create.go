package create

import (
	"cli/pkg/providers"
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"os"
)

var (
	providerName string
	namespace    string
	version      string
	CreateCmd    = &cobra.Command{
		Use:   "create",
		Short: "Creates an instance of Airy Core",
		Long:  ``,
		Run:   create,
	}
)

func init() {
	CreateCmd.Flags().StringVar(&providerName, "provider", "local", "One of the supported providers (aws|minikube).")
	CreateCmd.Flags().StringVar(&namespace, "namespace", "default", "(optional) Kubernetes namespace that Airy should be installed to.")
	CreateCmd.MarkFlagRequired("provider")

}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", providerName)

	provider := providers.MustGet(providers.ProviderName(providerName))

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
	if err := helm.InstallCharts(provider.GetHelmOverrides()); err != nil {
		fmt.Println("installing Helm charts failed with err: ", err)
		os.Exit(1)
	}

	if err = context.Store(); err != nil {
		fmt.Println("could not store the kube context: ", err)
		os.Exit(1)
	}

	fmt.Println("🚀 Starting core with default components")
	fmt.Println("🎉 Your Airy Core is ready")

	hosts, err := provider.GetHosts()
	if err != nil {
		fmt.Println("failed to get installation endpoints: ", err)
		os.Exit(1)
	}

	fmt.Println("\t 👩‍🍳 Available hosts:")
	hosts.ForEach(func(resource string, url string, description string) {
		fmt.Printf("\t\t %s %s:\t %s", resource, description, url)
		fmt.Println()
	})
	fmt.Println()

	if err = hosts.Store(); err != nil {
		fmt.Println("could not store the hosts: ", err)
		os.Exit(1)
	}

	if err = provider.PostInstallation(namespace); err != nil {
		fmt.Println("failed to get installation endpoints: ", err)
		os.Exit(1)
	}

	viper.Set("provider", provider)
	viper.WriteConfig()

	fmt.Printf("📚 For more information about the %s provider visit https://airy.co/docs/core/getting-started/installation/%s", providerName, providerName)
	fmt.Println()
}
