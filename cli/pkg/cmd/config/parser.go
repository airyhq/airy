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
	Security   map[string]string
	Components map[string]componentsConf
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
