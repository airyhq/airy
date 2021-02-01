package ui

import (
	"fmt"
	"log"
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
	Run:              demo,
}

func demo(cmd *cobra.Command, args []string) {
	// Initialize the api request

	url := "http://ui.airy/"

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
		log.Fatal(err)
	}

}
