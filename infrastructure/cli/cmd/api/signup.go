package api

import (
	"fmt"
	"os"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/airyhq/airy/lib/go/httpclient/payloads"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var signupCmd = &cobra.Command{
	Use:   "signup",
	Short: "Signs users up in the Airy Core Platform",
	Long:  ``,
	Run:   signup,
}

func signup(cmd *cobra.Command, args []string) {
	firstName, _ := cmd.Flags().GetString("firstName")
	lastName, _ := cmd.Flags().GetString("lastName")
	email, _ := cmd.Flags().GetString("email")
	password, _ := cmd.Flags().GetString("password")
	c := httpclient.NewClient(viper.GetString("apihost"))

	signupRequestPayload := payloads.SignupRequestPayload{FirstName: firstName, LastName: lastName, Email: email, Password: password}
	res, err := c.Signup(signupRequestPayload)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	fmt.Printf("user created: %s\n", res.ID)
}

func init() {
	var firstName, lastName, email, password string
	signupCmd.Flags().StringVarP(&firstName, "firstName", "f", "Grace", "First name")
	signupCmd.Flags().StringVarP(&lastName, "lastName", "l", "Hopper", "Last name")
	signupCmd.Flags().StringVarP(&email, "email", "e", "grace@hopper.com", "Email")
	signupCmd.Flags().StringVarP(&password, "password", "p", "the_answer_is_42", "Password")
}
