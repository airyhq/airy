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
		cluster.ClusterConfig.Security = conf.Security
	}

	payload, err := json.Marshal(cluster)
	if err != nil {
		return payloads.ClusterUpdateResponsePayload{}, err
	}
	return c.post[payloads.ClusterUpdateResponsePayload]("cluster.update", payload)
}
