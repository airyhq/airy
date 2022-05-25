package payloads

import (
	"github.com/airyhq/airy/lib/go/config"
)

type ClusterUpdateRequestPayload struct {
	Security config.SecurityConf `json:"security"`
}

type ClusterUpdateResponsePayload struct {
	ClusterConfig map[string]bool `json:"cluster_config"`
}
