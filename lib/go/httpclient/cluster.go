package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/config"
	"github.com/airyhq/airy/lib/go/payloads"
)

func (c *Client) ClusterUpdate(conf config.AiryConf) (payloads.ClusterUpdateResponsePayload, error) {

	cluster := payloads.ClusterUpdateRequestPayload{}
	secData := config.GetSecurityData(conf.Security)
	if len(secData) != 0 {
		cluster.Security = conf.Security
	}

	payload, err := json.Marshal(cluster)
	if err != nil {
		return payloads.ClusterUpdateResponsePayload{}, err
	}

	res := payloads.ClusterUpdateResponsePayload{}
	e := c.post("cluster.update", payload, &res)
	if e != nil {
		return payloads.ClusterUpdateResponsePayload{}, e
	}

	return res, nil
}
