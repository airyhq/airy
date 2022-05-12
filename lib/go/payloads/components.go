package payloads

import (
	"github.com/airyhq/airy/lib/go/config"
)

type ComponentsUpdateRequestPayload struct {
	Security   config.SecurityConf `yaml:"security"`
	Components []config.Component  `yaml:"components,omitempty"`
}

type ComponentsUpdateResponsePayload []config.Component

type ComponentsDeleteRequestPayload []string

type ComponentsDeleteResponsePayload []string
