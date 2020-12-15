package auth

import (
	"fmt"
	"log"

	"apiclient"
	"apiclient/payloads"

	"github.com/spf13/cobra"
)

// AuthCmd subcommand for Airy Core
var AuthCmd = &cobra.Command{
	Use:              "auth",
	TraverseChildren: true,
	Short:            "Create a default user and return a JWT token",
	Long:             ``,
	Run:              auth,
}

func auth(cmd *cobra.Command, args []string) {
	url, _ := cmd.Flags().GetString("url")
	email, _ := cmd.Flags().GetString("email")
	password, _ := cmd.Flags().GetString("password")
	c := apiclient.NewClient()
	c.BaseURL = url

	loginRequestPayload := payloads.LoginRequestPayload{Email: email, Password: password}

	res, err := c.Login(loginRequestPayload)
	if err != nil {
		signupRequestPayload := payloads.SignupRequestPayload{FirstName: "Firstname", LastName: "Lastname", Email: email, Password: password}
		res, err := c.Signup(signupRequestPayload)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(res.Token)
		return
	}
	fmt.Println(res.Token)
}

func init() {
	var url, email, password string
	AuthCmd.Flags().StringVarP(&url, "url", "u", "http://api.airy", "The url of the Airy API")
	AuthCmd.Flags().StringVarP(&email, "email", "e", "grace@hopper.com", "Email to use for the authentication")
	AuthCmd.Flags().StringVarP(&password, "password", "p", "the_answer_is_42", "Password to use for the authentication")
}
