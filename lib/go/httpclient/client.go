package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/payloads"
)

func (c *Client) Config() (*payloads.ClientConfigResponsePayload, error) {
	payload, err := json.Marshal(payloads.ClientConfigRequestPayload{})
	if err != nil {
		return nil, err
	}

	return c.post[payloads.ClientConfigResponsePayload]("client.config", payload)
}
