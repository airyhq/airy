package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/payloads"
)

//NOTE: As stated on httpclient.go for now we can use a general interface. because we are only getting
//      and printing the data
func (c *Client) ComponentsGet() (interface{}, error) {
	return c.post[interface{}]("components.get", nil)
}

func (c *Client) ComponentsUpdate(conf config.AiryConf) (payloads.ComponentsUpdateResponsePayload, error) {

	components := payloads.ComponentsUpdateRequestPayload{}
	components.Components = config.GetComponents(conf)
	for i, _ := range components.Components {
		components.Components[i].Data = payloads.ToSnakeCase(components.Components[i].Data)
	}

	payload, err := json.Marshal(components)
	if err != nil {
		return payloads.ComponentsUpdateResponsePayload{}, err
	}

	return c.post[payloads.ComponentsUpdateResponsePayload]("components.update", payload)
}
