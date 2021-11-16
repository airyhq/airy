package upgrade

import (
	"cli/pkg/cmd/config"
	"cli/pkg/console"
	"cli/pkg/helm"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"fmt"
	"os"

	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var (
	approve    bool
	version    string
	Version    string
	UpgradeCmd = &cobra.Command{
		Use:   "upgrade",
		Short: "Upgrades an instance of Airy Core",
		Long:  `Upgrades an existing Airy Core instance, read from a workspace directory (default .)`,
		Args:  cobra.MaximumNArgs(1),
		Run:   upgrade,
	}
)

func init() {
	UpgradeCmd.Flags().StringVar(&version, "version", "", "Specify a version to upgrade to (optional).")
	UpgradeCmd.Flags().BoolVar(&approve, "approve", false, "Upgrade automatically without asking for an approval (optional).")
}

func upgrade(cmd *cobra.Command, args []string) {
	autoApprove, _ := cmd.Flags().GetBool("approve")
	workspacePath, err := cmd.Flags().GetString("workspace")
	if err != nil {
		console.Exit("Unable to find suitable workspace :", err)
	}
	dir, err := workspace.Init(workspacePath)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	namespace := viper.GetString("namespace")
	if err != nil {
		console.Exit("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	if version == "" {
		version = Version
	}
	clusterAiryCore, err := kube.GetCmData("core-config", namespace, clientset)
	if err != nil {
		console.Exit("Unable to retrieve existing version of Airy Core: ", err.Error())
	}
	oldVersion := clusterAiryCore["APP_IMAGE_TAG"]

	fmt.Println("CLI version: ", Version)
	fmt.Println("Current Airy Core version: ", oldVersion)
	fmt.Println("New Airy Core version: ", version)
	fmt.Println()

	if autoApprove != true {
		if util.ConfirmToProceed() == false {
			console.Exit("Upgrade aborted.")
		}
	}

	fmt.Println("Upgrading the helm charts of Airy Core...")
	helm := helm.New(clientset, version, namespace, dir.GetAiryYaml())
	if cmErr := helm.UpsertAiryConfigMap(); cmErr != nil {
		console.Exit("Unable to copy config file into Airy Core :", cmErr)
	}
	if upgradeErr := helm.UpgradeCharts(); upgradeErr != nil {
		console.Exit("Upgrading the Helm Charts failed with err: ", upgradeErr)
	}

	fmt.Println("Applying config from the configuration file.")
	config.ApplyConfig(workspacePath)

	fmt.Println("✅ Airy Core upgraded")
	fmt.Println()
}
