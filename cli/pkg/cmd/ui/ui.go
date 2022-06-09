package ui

import (
	"cli/pkg/kube"
	"fmt"
	"os"
	"os/exec"
	"runtime"

	"github.com/spf13/viper"

	"github.com/spf13/cobra"

	"github.com/airyhq/airy/lib/go/k8s"
)

// UICmd opens the Airy Core UI
var UICmd = &cobra.Command{
	Use:              "ui",
	TraverseChildren: true,
	Short:            "Opens the Airy Core UI in your local browser",
	Long:             ``,
	Run:              ui,
}

func ui(cmd *cobra.Command, args []string) {
	kubeCtx := kube.Load()
	set, err := kubeCtx.GetClientSet()
	if err != nil {
		fmt.Println("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	coreConfig, err := k8s.GetCmData("core-config", viper.GetString("namespace"), set)
	if err != nil {
		fmt.Println("could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	url := fmt.Sprintf("%s/ui/", coreConfig["HOST"])

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("unsupported platform")
	}

	if err != nil {
		fmt.Println("could not open the Airy UI: ", err)
	}
}
