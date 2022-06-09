package payloads

import (
	"github.com/airyhq/airy/lib/go/config"
)

type ClusterUpdateRequestPayload struct {
	ClusterConfig config.ClusterConfig `json:"cluster_config"`
}

type ClusterUpdateResponsePayload struct {
	ClusterConfig map[string]bool `json:"cluster_config"`
}
