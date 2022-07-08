package payloads

import (
	"github.com/airyhq/airy/lib/go/config"
	"github.com/iancoleman/strcase"
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

type ComponentsInstallRequestPayload struct {
	Name string `json:"name,omitempty"`
}

type ComponentsDeleteResponsePayload struct {
	Components map[string]bool `json:"components,omitempty"`
}

func ToSnakeCase(m map[string]string) map[string]string {
	rm := make(map[string]string)
	for k, v := range m {
		rm[strcase.ToSnake(k)] = v
	}
	return rm
}

func ToCamelCase(m map[string]string) map[string]string {
	rm := make(map[string]string)
	for k, v := range m {
		rm[strcase.ToLowerCamel(k)] = v
	}
	return rm
}
