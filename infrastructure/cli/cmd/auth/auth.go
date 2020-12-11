package auth

import (
	"fmt"

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
	c := apiclient.NewClient()
	c.BaseURL = url

	loginRequestPayload := payloads.LoginRequestPayload{Email: "grace@example.com", Password: "the_answer_is_42"}

	res, err := c.Login(loginRequestPayload)
	if err != nil {
		signupRequestPayload := payloads.SignupRequestPayload{FirstName: "Grace", LastName: "Hopper", Email: "grace@example.com", Password: "the_answer_is_42"}
		res, err := c.Signup(signupRequestPayload)
		if err != nil {
			fmt.Println(err)
			return
		}
		fmt.Println(res.Token)
	}
	fmt.Println(res.Token)
}

func init() {
	var url string
	AuthCmd.Flags().StringVarP(&url, "url", "u", "http://api.airy", "The url of the Airy api")
}
