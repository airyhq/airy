package payloads

import (
	"github.com/airyhq/airy/lib/go/config"
)

type ComponentsUpdateRequestPayload struct {
	Components []config.Component `json:"components,omitempty"`
}

type ComponentsUpdateResponsePayload struct {
	Components map[string]bool `json:"components,omitempty"`
}

type ComponentsDeleteRequestPayload struct {
	Components []string `json:"components,omitempty"`
}

type ComponentsDeleteResponsePayload struct {
	Components map[string]bool `json:"components,omitempty"`
}
