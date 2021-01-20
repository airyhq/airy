package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/httpclient/payloads"
)

func (c *Client) Signup(signupRequestPayload payloads.SignupRequestPayload) (*payloads.SignupResponsePayload, error) {
	payload, err := json.Marshal(signupRequestPayload)
	if err != nil {
		return nil, err
	}

	res := payloads.SignupResponsePayload{}

	e := c.post("users.signup", payload, &res)
	if e != nil {
		return nil, e
	}

	return &res, nil
}

func (c *Client) Login(loginRequestPayload payloads.LoginRequestPayload) (*payloads.LoginResponsePayload, error) {
	payload, err := json.Marshal(loginRequestPayload)
	if err != nil {
		return nil, err
	}
	res := payloads.LoginResponsePayload{}
	e := c.post("users.login", payload, &res)
	if e != nil {
		return nil, e
	}
	return &res, nil
}
