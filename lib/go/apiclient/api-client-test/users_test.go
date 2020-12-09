package tests

import (
	"apiclient"
	"apiclient/payloads"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSignup(t *testing.T) {
	c := apiclient.NewClient()

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "{\"id\":\"a6c413a7-8d42-4c2b-8736-d033134eec59\",\"first_name\":\"Grace\",\"last_name\":\"Hopper\",\"token\":\"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJzdWIiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJpYXQiOjE2MDczMzY2NjMsInVzZXJfaWQiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJleHAiOjE2MDc0MjMwNjN9.I4sf2j36RQCPRrirzSYyRhJ4U3bG2sUmHfxX4yBJvQA\"}")
	}))
	c.BaseURL = ts.URL

	signupRequestPayload := payloads.SignupRequestPayload{FirstName: "Grace", LastName: "Hopper", Password: "the_answer_is_42", Email: "grace@example.com"}

	res, err := c.Signup(signupRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}

func TestLogin(t *testing.T) {
	c := apiclient.NewClient()

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "{\"id\":\"a6c413a7-8d42-4c2b-8736-d033134eec59\",\"first_name\":\"Grace\",\"last_name\":\"Hopper\",\"token\":\"eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJzdWIiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJpYXQiOjE2MDczMzY2NjMsInVzZXJfaWQiOiJhNmM0MTNhNy04ZDQyLTRjMmItODczNi1kMDMzMTM0ZWVjNTkiLCJleHAiOjE2MDc0MjMwNjN9.I4sf2j36RQCPRrirzSYyRhJ4U3bG2sUmHfxX4yBJvQA\"}")
	}))
	c.BaseURL = ts.URL

	loginRequestPayload := payloads.LoginRequestPayload{Password: "the_answer_is_42", Email: "grace@example.com"}

	res, err := c.Login(loginRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}
