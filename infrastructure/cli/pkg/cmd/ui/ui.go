package ui

import (
	"fmt"
	"os/exec"
	"runtime"

	"github.com/spf13/cobra"
)

//TODO make this a config
const url = "http://airy.core/"

// UICmd opens the Airy Core UI
var UICmd = &cobra.Command{
	Use:              "ui",
	TraverseChildren: true,
	Short:            "Opens the Airy Core UI in your local browser",
	Long:             ``,
	Run:              ui,
}

func ui(cmd *cobra.Command, args []string) {
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
