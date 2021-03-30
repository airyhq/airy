package create

import (
	"cli/pkg/console"
	"cli/pkg/kube"
	"cli/pkg/providers"
	"fmt"
	"github.com/TwinProduction/go-color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
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

	middleware := console.IndentOutput(func (input string) string {
		return color.Colorize(color.Yellow, "#\t" + input)
	})

	fmt.Println()
	fmt.Println(providerName, "provider output:")
	fmt.Println()
	context, err := provider.Provision()
	fmt.Println()
	middleware.Close()
	if err != nil {
		console.Exit("could not provision cluster: ", err)
	}

	fmt.Println("✅ Cluster provisioned")

	clientset, err := context.GetClientSet()
	if err != nil {
		console.Exit("could not get clientset: ", err)
	}

	if err = context.Store(); err != nil {
		console.Exit("could not store the kube context: ", err)
	}

	helm := New(clientset, version, namespace)
	if err := helm.Setup(); err != nil {
		console.Exit("setting up Helm failed with err: ", err)
	}

	fmt.Println("🚀 Starting core with default components")

	if err := helm.InstallCharts(provider.GetHelmOverrides()); err != nil {
		console.Exit("installing Helm charts failed with err: ", err)
	}

	if err = provider.PostInstallation(namespace); err != nil {
		console.Exit("failed to run post installation hook: ", err)
	}

	fmt.Println("🎉 Your Airy Core is ready")

	hosts, err := kube.GetHosts(clientset, namespace)
	if err != nil {
		console.Exit("failed to get hosts from installation")
	}

	fmt.Println("\t 👩‍🍳 Available hosts:")
	for hostName, host := range hosts {
		fmt.Printf("\t\t %s:\t %s", explainHost(hostName), host)
		fmt.Println()
	}

	fmt.Println()

	viper.Set("provider", provider)
	viper.Set("namespace", namespace)
	viper.WriteConfig()

	fmt.Printf("📚 For more information about the %s provider visit https://airy.co/docs/core/getting-started/installation/%s", providerName, providerName)
	fmt.Println()
}

func explainHost(hostName string) string {
	switch hostName {
	case "HOST":
		return "api"
	case "NGROK":
		return "ngrok"
	}

	return hostName
}
