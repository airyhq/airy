package create

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	provider   string
	kubeConfig string
	version    string
	CreateCmd  = &cobra.Command{
		Use:   "create",
		Short: "Creates an instance of Airy Core",
		Long:  ``,
		Run:   create,
	}
)

func init() {
	CreateCmd.Flags().StringVar(&provider, "provider", "", "One of the supported providers (aws|local). Default is aws")
	CreateCmd.Flags().StringVar(&kubeConfig, "kube-config", "", "Path to the kubeconfig used to communicate with the cluster")
	CreateCmd.Flags().StringVar(&version, "version", "", "Version of Airy Core to run this command for.")
	// TODO set this to the version of the CLI
	// TODO ask the user to continue with a warning if flag version > cli version
	viper.SetDefault("version", "develop")
	viper.SetDefault("provider", "aws")
}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", provider)

	helm := New(kubeConfig, version, "default")
	helm.Setup()
	helm.InstallCharts()
	fmt.Println("🚀 Starting core with default components")
	fmt.Println("🎉 Your Airy Core is ready")
	fmt.Println("\t Link to the API")
	fmt.Println("\t Link to the UI")
	fmt.Println("\t Link to more docs")
}
