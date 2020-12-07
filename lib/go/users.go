package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"net/http"
)

func (c *Client) Signup(ctx context.Context, signupRequestPayload SignupRequestPayload) (*SignupResponsePayload, error) {
	requestDataJSON, err := json.Marshal(signupRequestPayload)

	req, err := http.NewRequest("POST", fmt.Sprintf("%s/users.signup", c.BaseURL), bytes.NewBuffer(requestDataJSON))
	if err != nil {
		return nil, err
	}

	req = req.WithContext(ctx)

	res := SignupResponsePayload{}
	if err := c.sendRequest(req, &res); err != nil {
		return nil, err
	}

	return &res, nil

}
