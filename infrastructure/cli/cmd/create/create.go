package create

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"k8s.io/client-go/util/homedir"
	"os"
	"path/filepath"
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

const defaultKubeConfig = "$HOME/.kube/config"

func init() {
	if home := homedir.HomeDir(); home != "" {
		CreateCmd.Flags().StringVar(&kubeConfig, "kubeconfig", defaultKubeConfig, "(optional) absolute path to the kubeconfig file")
	} else {
		CreateCmd.Flags().StringVar(&kubeConfig, "kubeconfig", "", "absolute path to the kubeconfig file")
	}

	CreateCmd.Flags().StringVar(&provider, "provider", "", "One of the supported providers (aws|local). Default is aws")
	CreateCmd.Flags().MarkHidden("kubeconfig")

	viper.SetDefault("provider", "aws")
}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", provider)

	if kubeConfig == defaultKubeConfig {
		kubeConfig = filepath.Join(homedir.HomeDir(), ".kube", "config")
	}

	helm := New(kubeConfig, "develop", "default")
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
