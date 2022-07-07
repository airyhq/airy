package create

import (
	"cli/pkg/console"
	"cli/pkg/helm"
	"cli/pkg/providers"
	"cli/pkg/workspace"
	"fmt"
	"os"
	"runtime"

	"github.com/airyhq/airy/lib/go/k8s"

	"github.com/TwinProduction/go-color"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gopkg.in/segmentio/analytics-go.v3"
)

var (
	providerName    string
	providerConfig  map[string]string
	namespace       string
	version         string
	initOnly        bool
	disableTracking bool
	CreateCmd       = &cobra.Command{
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
	CreateCmd.Flags().BoolVar(&disableTracking, "disable-tracking", false, "Disables sending anonymous events to Segment.")
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

	var rtm runtime.MemStats
	runtime.ReadMemStats(&rtm)

	airyAnalytics := console.NewAiryAnalytics(disableTracking)
	airyAnalytics.Track(analytics.Track{
		AnonymousId: "AiryUser",
		Event:       "installation_started",
	})
	provider := providers.MustGet(providers.ProviderName(providerName), w, airyAnalytics)
	overrides := provider.GetOverrides()
	overrides.Version = version
	overrides.Namespace = namespace
	overrides.TrackingDisabled = disableTracking
	isValidEnv, err := provider.IsEnvironmentValid()

	if !isValidEnv {
		console.Exit("please check if the install requirements are set up", err)
	}

	dir, err := workspace.Create(workspacePath, overrides)
	if err != nil {
		console.Exit("could not initialize Airy workspace directory", err)
	}
	fmt.Println("📁 Initialized Airy workspace directory at", dir.GetPath("."))
	if initOnly {
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

	if err = provider.PostInstallation(providerConfig, namespace, dir); err != nil {
		console.Exit("failed to run post installation hook: ", err)
	}

	fmt.Println("🎉 Your Airy Core is ready")

	coreConfig, err := k8s.GetCmData("core-config", namespace, clientset)
	if err != nil {
		console.Exit("failed to get hosts from installation")
	}

	fmt.Println("\t 👩‍🍳 Available hosts:")
	for hostName, host := range coreConfig {
		switch hostName {
		case "HOST":
			fmt.Printf("\t\t %s:\t %s", "Host", host)
			fmt.Println()
		case "API_HOST":
			fmt.Printf("\t\t %s:\t %s", "API", host)
			fmt.Println()
		case "NGROK":
			fmt.Printf("\t\t %s:\t %s", "NGROK", host)
			fmt.Println()
		}
	}

	fmt.Println()

	viper.Set("provider", provider)
	viper.Set("namespace", namespace)
	viper.WriteConfig()

	airyAnalytics.Track(analytics.Track{
		UserId: coreConfig["CORE_ID"],
		Event:  "installation_succesful"})
	fmt.Printf("📚 For more information about the %s provider visit https://airy.co/docs/core/getting-started/installation/%s", providerName, providerName)
	fmt.Println()
}
