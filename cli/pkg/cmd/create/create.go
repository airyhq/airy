package create

import (
	"cli/pkg/console"
	"cli/pkg/providers"
	"cli/pkg/workspace"
	"fmt"
	"os"
	"runtime"

	"github.com/TwinProduction/go-color"
	"github.com/spf13/cobra"
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
	if err := provider.CheckEnvironment(); err != nil {
		console.Exit("please set up the required environment for the installation", err)
	}

	dir, err := workspace.Create(workspacePath, overrides)
	if err != nil {
		console.Exit("could not initialize Airy workspace directory", err)
	}
	fmt.Println("📁 Initialized Airy workspace directory at", dir.GetPath("."))

	installDir, err := provider.PreInstallation(dir.GetPath("."))
	if err != nil {
		console.Exit("could not set up files for install in Airy workspace directory", err)
	}
	fmt.Println("📁 Set up installation directory in the Airy workspace at", installDir)
	if initOnly {
		os.Exit(0)
	}

	fmt.Println("⚙️  Creating core with provider", providerName)
	fmt.Fprintln(w)
	fmt.Fprintln(w, providerName, "provider output:")
	fmt.Fprintln(w)
	err = provider.Provision(providerConfig, workspace.ConfigDir{Path: installDir})
	fmt.Fprintln(w)
	if err != nil {
		console.Exit("could not install Airy: ", err)
	}
}
