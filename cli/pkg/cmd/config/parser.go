package config

import (
	"io/ioutil"

	"gopkg.in/yaml.v2"
)

type kubernetesConf struct {
	AppImageTag       string `yaml:"appImageTag"`
	ContainerRegistry string `yaml:"containerRegistry"`
	Namespace         string `yaml:"namespace"`
	NgrokEnabled      string `yaml:"ngrokEnabled"`
}

type componentsConf map[string]map[string]string

type airyConf struct {
	Kubernetes kubernetesConf
	Security   securityConf
	Components map[string]componentsConf
}

type securityConf struct {
	SystemToken string `yaml:"systemToken"`
	AllowedOrigins string `yaml:"allowedOrigins"`
	JwtSecret string `yaml:"jwtSecret"`
	Oidc map[string]string `yaml:"oidc"`
}

func (s securityConf) getData() map[string]string {
	m := make(map[string]string, len(s.Oidc))

	if s.SystemToken != "" {
		m["systemToken"] = s.SystemToken
	}
	if s.AllowedOrigins != "" {
		m["allowedOrigins"] = s.AllowedOrigins
	}
	if s.JwtSecret != "" {
		m["jwtSecret"] = s.JwtSecret
	}

	for key, value := range s.Oidc {
		if value != "" {
			m["oidc." + key] = value
		}
	}

	return m
}

func parseConf(configFile string) (airyConf, error) {
	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		return airyConf{}, err
	}
	conf := airyConf{}
	err = yaml.Unmarshal(data, &conf)
	return conf, err
}
