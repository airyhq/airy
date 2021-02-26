package create

import (
	"fmt"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"k8s.io/client-go/util/homedir"
	"log"
	"path/filepath"
)

var (
	provider   string
	kubeConfig string
	coreConfig string
	version    string
	CreateCmd  = &cobra.Command{
		Use:   "create",
		Short: "Creates an instance of Airy Core",
		Long:  ``,
		Run:   create,
	}
)

func init() {
	if home := homedir.HomeDir(); home != "" {
		CreateCmd.Flags().StringVar(&kubeConfig, "kubeconfig", filepath.Join(home, ".kube", "config"), "(optional) absolute path to the kubeconfig file")
	} else {
		CreateCmd.Flags().StringVar(&kubeConfig, "kubeconfig", "", "absolute path to the kubeconfig file")
	}

	CreateCmd.Flags().StringVar(&provider, "provider", "", "One of the supported providers (aws|local). Default is aws")
	CreateCmd.Flags().StringVar(&coreConfig, "airyconfig", "", "Absolute path to the core airy.yaml config")

	CreateCmd.MarkFlagRequired("airyconfig")
	viper.SetDefault("provider", "aws")
}

func create(cmd *cobra.Command, args []string) {
	fmt.Println("⚙️  Creating core with provider", provider)

	helm := New(kubeConfig, "develop", "default", coreConfig)
	if err := helm.Setup(); err != nil {
		log.Fatalf("setting up Helm failed with err %v", err)
	}
	if err := helm.InstallCharts(); err != nil {
		log.Fatalf("installing Helm charts failed with err %v", err)
	}
	fmt.Println("🚀 Starting core with default components")
	fmt.Println("🎉 Your Airy Core is ready")
	fmt.Println("\t Link to the API")
	fmt.Println("\t Link to the UI")
	fmt.Println("\t Link to more docs")
}
