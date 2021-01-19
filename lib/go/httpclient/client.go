package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/httpclient/payloads"
)

func (c *Client) Config() (*payloads.ClientConfigResponsePayload, error) {
	payload, err := json.Marshal(payloads.ClientConfigRequestPayload{})
	if err != nil {
		return nil, err
	}

	res := payloads.ClientConfigResponsePayload{}

	e := c.post("client.config", payload, &res)
	if e != nil {
		return nil, e
	}

	return &res, nil
}
