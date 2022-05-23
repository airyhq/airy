package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/payloads"
)

//NOTE: As stated on httpclient.go for now we can use a general interface. because we are only getting
//      and printing the data
func (c *Client) ComponentsGet() (interface{}, error) {
	components, err := c.get("components.get")
	if err != nil {
		return nil, err
	}

	return components, nil
}

func (c *Client) ComponentsUpdate(conf config.AiryConf) (payloads.ComponentsUpdateResponsePayload, error) {

	components := payloads.ComponentsUpdateRequestPayload{}
	secData := config.GetSecurityData(conf.Security)
	if len(secData) != 0 {
		components.Security = conf.Security
	}

	components.Components = config.GetComponents(conf)

	payload, err := json.Marshal(components)
	if err != nil {
		return nil, err
	}

	res := payloads.ComponentsUpdateResponsePayload{}
	e := c.post("components.update", payload, &res)
	if e != nil {
		return nil, e
	}

	return res, nil
}
