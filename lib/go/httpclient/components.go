package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/payloads"
)

func (c *Client) ComponentsUpdate(conf config.AiryConf) (payloads.ComponentsUpdateResponsePayload, error) {

	components := payloads.ComponentsUpdateRequestPayload{}

	components.Components = config.GetComponents(conf)

	payload, err := json.Marshal(components)
	if err != nil {
		return payloads.ComponentsUpdateResponsePayload{}, err
	}

	res := payloads.ComponentsUpdateResponsePayload{}
	e := c.post("components.update", payload, &res)
	if e != nil {
		return payloads.ComponentsUpdateResponsePayload{}, e
	}

	return res, nil
}
