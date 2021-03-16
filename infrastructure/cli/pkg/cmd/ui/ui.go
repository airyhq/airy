package ui

import (
	"cli/pkg/core"
	"fmt"
	"os"
	"os/exec"
	"runtime"

	"github.com/spf13/cobra"
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
	hosts := core.LoadHostsFromConfig()
	url := hosts.Ui.Url
	if url == "" {
		fmt.Println("Could not find an installation of Airy Core. Get started here https://airy.co/docs/core/getting-started/installation/introduction")
		os.Exit(1)
	}

	var err error

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
