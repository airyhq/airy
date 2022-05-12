package config

type Component struct {
	Name    string            `json:"name"`
	Enabled bool              `json:"enabled",omitempty`
	Data    map[string]string `yaml:"data,omitempty"`
}

func GetComponents(conf AiryConf) []Component {
	var components []Component
	for componentType, component := range conf.Components {
		for componentName, data := range component {
			components = append(components, Component{
				Name:    componentType + "-" + componentName,
				Enabled: true,
				Data:    data,
			})
		}
	}
	return components
}
