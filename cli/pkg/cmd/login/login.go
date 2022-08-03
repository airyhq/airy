package login

import (
	"cli/pkg/console"
	"fmt"
	"golang.org/x/term"
	"strings"
	"syscall"

	"github.com/spf13/viper"

	"github.com/spf13/cobra"
)

// LoginCmd Logs in the current workspace
var LoginCmd = &cobra.Command{
	Use:              "login",
	TraverseChildren: true,
	Short:            "Authenticates your workspace with Airy core and stores the credentials.",
	Long:             ``,
	Run:              login,
}

func login(cmd *cobra.Command, args []string) {
	authToken := viper.GetString("authToken")
	if authToken != "" {
		fmt.Println("There is already a valid auth token stored in your cli.yaml. If you want to login again, please remove the auth token from your config file.")
		return
	}

	fmt.Print("Enter your system token: ")
	byteToken, err := term.ReadPassword(int(syscall.Stdin))
	if err != nil {
		console.Exit(err)
	}

	token := strings.TrimSpace(string(byteToken))
	fmt.Println("\nAuthentication set")
	viper.Set("authToken", token)
	viper.WriteConfig()
}
