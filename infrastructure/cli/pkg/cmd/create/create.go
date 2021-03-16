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
		Exit("could not provision cluster: ", err)
	}

	clientset, err := context.GetClientSet()
	if err != nil {
		Exit("could not get clientset: ", err)
	}

	helm := New(clientset, version, namespace)
	if err := helm.Setup(); err != nil {
		Exit("setting up Helm failed with err: ", err)
	}
	if err := helm.InstallCharts(provider.GetHelmOverrides()); err != nil {
		Exit("installing Helm charts failed with err: ", err)
	}

	if err = context.Store(); err != nil {
		Exit("could not store the kube context: ", err)
	}

	fmt.Println("🚀 Starting core with default components")
	fmt.Println("🎉 Your Airy Core is ready")

	hosts, err := provider.GetHosts()
	if err != nil {
		Exit("failed to get installation endpoints: ", err)
	}

	fmt.Println("\t 👩‍🍳 Available hosts:")
	hosts.ForEach(func(resource string, url string, description string) {
		fmt.Printf("\t\t %s %s:\t %s", resource, description, url)
		fmt.Println()
	})
	fmt.Println()

	if err = hosts.Store(); err != nil {
		Exit("could not store the hosts: ", err)
	}

	if err = provider.PostInstallation(namespace); err != nil {
		Exit("failed to get installation endpoints: ", err)
	}

	viper.Set("provider", provider)
	viper.WriteConfig()

	fmt.Printf("📚 For more information about the %s provider visit https://airy.co/docs/core/getting-started/installation/%s", providerName, providerName)
	fmt.Println()
}

func Exit(msg ...interface{}) {
	fmt.Print("❌ ", fmt.Sprintln(msg))
	os.Exit(1)
}
