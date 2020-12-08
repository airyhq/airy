package apiclienttest

import (
	"apiclient"
	"apiclient/payloads"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSignup(t *testing.T) {
	c := apiclient.NewClient()

	signupRequestPayload := payloads.SignupRequestPayload{FirstName: "Grace", LastName: "Hopper", Password: "the_answer_is_42", Email: "grace@example.com"}

	res, err := c.Signup(signupRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}

func TestLogin(t *testing.T) {
	c := apiclient.NewClient()

	loginRequestPayload := payloads.LoginRequestPayload{Password: "the_answer_is_42", Email: "grace@example.com"}

	res, err := c.Login(loginRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}
