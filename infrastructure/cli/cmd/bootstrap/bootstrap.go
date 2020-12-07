package bootstrap

import (
	"fmt"
	"log"
	"os"

	"github.com/spf13/cobra"
)

// ResponsePayload for receiving the request

// BootstrapCmd subcommand for Airy Core
var BootstrapCmd = &cobra.Command{
	Use:              "bootstrap",
	TraverseChildren: true,
	Short:            "Bootstrap Airy Core Platform locally",
	Long: `This will install the Airy Core Platform in the current directory unless you choose a different one.
	It will also try to install Vagrant and VirtualBox.`,
	Run: bootstrap,
}

func bootstrap(cmd *cobra.Command, args []string) {
	// Initialize the api request

	log.Println("Starting bootstrap")

	path, err := os.Getwd()
	if err != nil {
		log.Println(err)
	}
	fmt.Println("Do you want to install the Airy Core Platform at %s?", path)

}

func init() {
	var imageTag string
	BootstrapCmd.Flags().StringVarP(&imageTag, "image-tag", "i", "", "The docker image tag that the Airy apps will use.")
}
