package demo

import (
	"fmt"
	"log"
	"os/exec"
	"runtime"

	"github.com/spf13/cobra"
)

// ResponsePayload for receiving the request

// DemoCmd subcommand for Airy Core
var DemoCmd = &cobra.Command{
	Use:              "demo",
	TraverseChildren: true,
	Short:            "Opens the demo page in the browser",
	Long:             ``,
	Run:              demo,
}

func demo(cmd *cobra.Command, args []string) {
	// Initialize the api request

	url := "http://chatplugin.airy/example.html"

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

func init() {
}
