package auth

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/spf13/cobra"
)

type signupRequestPayload struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type signupResponsePayload struct {
	ID        string
	FirstName string
	LastName  string
	Token     string
}

type loginRequestPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponsePayload struct {
	ID        string
	FirstName string
	LastName  string
	Token     string
}

// AuthCmd subcommand for Airy Core
var AuthCmd = &cobra.Command{
	Use:              "auth",
	TraverseChildren: true,
	Short:            "Create a default user and return a JWT token",
	Long:             ``,
	Run:              auth,
}

func sendRequest(requestDataJSON []byte, url string) ([]byte, int) {
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(requestDataJSON))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	log.Println(resp.StatusCode)
	response, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	return response, resp.StatusCode

}

func auth(cmd *cobra.Command, args []string) {
	host := "http://api.airy"

	loginRequestPayload := loginRequestPayload{Email: "grace@example.com", Password: "the_answer_is_42"}
	requestDataJSON, err := json.Marshal(loginRequestPayload)
	if err != nil {
		log.Fatal(err)
	}

	loginResponseBody, statusCode := sendRequest(requestDataJSON, host+"/users.login")
	if statusCode != 200 {
		signupRequestPayload := signupRequestPayload{FirstName: "Grace", LastName: "Hopper", Password: "the_answer_is_42", Email: "grace@example.com"}
		requestDataJSON, err := json.Marshal(signupRequestPayload)
		if err != nil {
			log.Fatal(err)
		}

		signupResponseBody, statusCode := sendRequest(requestDataJSON, host+"/users.signup")
		if statusCode != 200 {
			log.Fatal(statusCode)
		}
		var signupResponsePayload signupResponsePayload
		jsonErr := json.Unmarshal(signupResponseBody, &signupResponsePayload)
		if jsonErr != nil {
			log.Fatal(jsonErr)
		}
		fmt.Println(signupResponsePayload.Token)
		return

	}

	var loginResponsePayload loginResponsePayload
	jsonErr := json.Unmarshal(loginResponseBody, &loginResponsePayload)
	if jsonErr != nil {
		log.Println(loginResponseBody)
		log.Fatal("Error unmarshaling response")
	}
	fmt.Println(loginResponsePayload.Token)
}

func init() {
	var appname string
	AuthCmd.Flags().StringVarP(&appname, "app-name", "a", "", "The app which we will reset.")
}
