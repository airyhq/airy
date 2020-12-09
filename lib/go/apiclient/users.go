package apiclient

import (
	"apiclient/payloads"
	"encoding/json"
)

func (c *Client) Signup(signupRequestPayload payloads.SignupRequestPayload) (*payloads.SignupResponsePayload, error) {
	requestDataJSON, err := json.Marshal(signupRequestPayload)
	if err != nil {
		return nil, err
	}
	res := payloads.SignupResponsePayload{}

	if err := c.sendRequest(requestDataJSON, "users.signup", &res); err != nil {
		return nil, err
	}

	return &res, nil

}

func (c *Client) Login(loginRequestPayload payloads.LoginRequestPayload) (*payloads.LoginResponsePayload, error) {
	requestDataJSON, err := json.Marshal(loginRequestPayload)
	if err != nil {
		return nil, err
	}
	res := payloads.LoginResponsePayload{}

	if err := c.sendRequest(requestDataJSON, "users.login", &res); err != nil {
		return nil, err
	}

	return &res, nil

}
