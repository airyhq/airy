package api

import (
	"fmt"
	"os"

	"github.com/airyhq/airy/lib/go/httpclient"
	"github.com/airyhq/airy/lib/go/httpclient/payloads"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var loginCmd = &cobra.Command{
	Use:   "login",
	Short: "Login into an Airy Core instance",
	Long:  ``,
	Run:   login,
}

func login(cmd *cobra.Command, args []string) {
	email, _ := cmd.Flags().GetString("email")
	password, _ := cmd.Flags().GetString("password")
	c := httpclient.NewClient(viper.GetString("apihost"))

	loginRequestPayload := payloads.LoginRequestPayload{Email: email, Password: password}
	res, err := c.Login(loginRequestPayload)
	if err != nil {
		fmt.Println("could not login:", err)
		os.Exit(1)
	}
	fmt.Printf("logged in correctly: %s\n", res.Token)

	viper.Set("apiJWTToken", res.Token)
	viper.WriteConfig()
}

func init() {
	var email, password string
	loginCmd.Flags().StringVarP(&email, "email", "e", "grace@example.com", "Email")
	loginCmd.Flags().StringVarP(&password, "password", "p", "the_answer_is_42", "Password")
}
