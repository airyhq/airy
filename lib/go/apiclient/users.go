package apiclient

import (
	"apiclient/payloads"
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func (c *Client) Signup(signupRequestPayload payloads.SignupRequestPayload) (*payloads.SignupResponsePayload, error) {
	requestDataJSON, err := json.Marshal(signupRequestPayload)

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/users.signup", c.BaseURL), bytes.NewBuffer(requestDataJSON))
	if err != nil {
		return nil, err
	}

	res := payloads.SignupResponsePayload{}

	if err := c.sendRequest(req, &res); err != nil {
		return nil, err
	}

	return &res, nil

}

func (c *Client) Login(loginRequestPayload payloads.LoginRequestPayload) (*payloads.LoginResponsePayload, error) {
	requestDataJSON, err := json.Marshal(loginRequestPayload)

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/users.login", c.BaseURL), bytes.NewBuffer(requestDataJSON))
	if err != nil {
		return nil, err
	}

	res := payloads.LoginResponsePayload{}

	if err := c.sendRequest(req, &res); err != nil {
		return nil, err
	}

	return &res, nil

}
