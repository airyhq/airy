package upgrade

import (
	"cli/pkg/cmd/config"
	"cli/pkg/console"
	"cli/pkg/helm"
	"cli/pkg/kube"
	"cli/pkg/workspace"
	"fmt"

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
	dir := workspace.Init(workspacePath)
	kubeCtx := kube.Load()
	clientset, err := kubeCtx.GetClientSet()
	namespace := viper.GetString("namespace")
	if err != nil {
		console.Exit("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
	}

	if version == "" {
		version = Version
	}
	clusterAiryConf, err := kube.GetDeployedAiryYaml(namespace, clientset)
	if err != nil {
		console.Exit("Unable to retrieve existing version of Airy Core: ", err.Error())
	}
	oldVersion := clusterAiryConf.Kubernetes.AppImageTag

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
		fmt.Println("Upgrading the Helm Charts failed with err: ", upgradeErr)
		fmt.Println("Attempting to roll back the upgrade...")
		if rollBackErr := helm.RollBackUpgrade(oldVersion); rollBackErr != nil {
			console.Exit("Roll Back of the upgrade failed with err: ", rollBackErr)
		}
		console.Exit("The roll back of the upgrade was successful.")
	}

	fmt.Println("Applying config from the configuration file.")
	config.ApplyConfig(workspacePath)

	fmt.Println(("Writing the new version into the configuration file."))
	if writeVersionErr := dir.UpdateAiryYaml(func(conf workspace.AiryConf) workspace.AiryConf {
		conf.Kubernetes.AppImageTag = version
		return conf
	}); writeVersionErr != nil {
		console.Exit("Writing the version into config file failed with err: ", writeVersionErr)
	}

	fmt.Println("Copying the configuration file in the Airy Core K8s cluster.")
	if cmErr := helm.UpsertAiryConfigMap(); cmErr != nil {
		console.Exit("Unable to copy config file into Airy Core.")
	}

	fmt.Println("✅ Airy Core upgraded")
	fmt.Println()
}
