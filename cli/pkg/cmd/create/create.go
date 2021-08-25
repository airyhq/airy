package create

import (
	"cli/pkg/cmd/config"
	"cli/pkg/console"
	"cli/pkg/helm"
	"cli/pkg/kube"
	"cli/pkg/providers"
	"cli/pkg/workspace"
	"fmt"
	"os"

	"github.com/TwinProduction/go-color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	providerName   string
	providerConfig map[string]string
	namespace      string
	version        string
	initOnly       bool
	noApply        bool
	CreateCmd      = &cobra.Command{
		Use:   "create [workspace directory]",
		Short: "Creates an instance of Airy Core",
		Long:  `Creates a workspace directory (default .) with default configuration and starts an Airy Core instance using the given provider`,
		Args:  cobra.MaximumNArgs(1),
		Run:   create,
	}
)

func init() {
	CreateCmd.Flags().StringVar(&providerName, "provider", "minikube", "One of the supported providers (aws|minikube).")
	CreateCmd.Flags().StringToStringVar(&providerConfig, "provider-config", nil, "Additional configuration for the providers.")
	CreateCmd.Flags().StringVar(&namespace, "namespace", "default", "(optional) Kubernetes namespace that Airy should be installed to.")
	CreateCmd.Flags().BoolVar(&initOnly, "init-only", false, "Only create the airy workspace directory and exit.")
	CreateCmd.Flags().BoolVar(&noApply, "no-apply", false, "Don't apply any component configuration found in an existing airy.yaml file after creation.")
	CreateCmd.MarkFlagRequired("provider")
}

func create(cmd *cobra.Command, args []string) {
	workspacePath := ""
	if len(args) > 0 {
		workspacePath = args[0]
	}

	w := console.GetMiddleware(func(input string) string {
		return color.Colorize(color.Cyan, "#\t"+input)
	})
	provider := providers.MustGet(providers.ProviderName(providerName), w)
	overrides := provider.GetOverrides()
	overrides.Version = version
	overrides.Namespace = namespace
	dir, err := workspace.Create(workspacePath, overrides)
	if err != nil {
		console.Exit("could not initialize Airy workspace directory", err)
	}
	fmt.Println("📁 Initialized Airy workspace directory at", dir.GetPath("."))
	if initOnly == true {
		os.Exit(0)
	}

	fmt.Println("⚙️  Creating core with provider", providerName)
	fmt.Fprintln(w)
	fmt.Fprintln(w, providerName, "provider output:")
	fmt.Fprintln(w)
	context, err := provider.Provision(providerConfig, dir)
	fmt.Fprintln(w)
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

	helm := helm.New(clientset, version, namespace, dir.GetAiryYaml())
	if err := helm.Setup(); err != nil {
		console.Exit("setting up Helm failed with err: ", err)
	}

	fmt.Println("🚀 Starting core with default components")

	if err := helm.InstallCharts(); err != nil {
		console.Exit("installing Helm charts failed with err: ", err)
	}

	if err = provider.PostInstallation(providerConfig, dir); err != nil {
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

	if noApply != true {
		fmt.Println("⚙️  Applying config from airy.yaml")
		config.ApplyConfig(workspacePath)
	}

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
