package config

import (
	"fmt"
	"io/ioutil"
	"os"

	"gopkg.in/yaml.v2"
)

type globalConf struct {
	AppImageTag       string `yaml:"appImageTag"`
	ContainerRegistry string `yaml:"containerRegistry"`
	Namespace         string `yaml:"namespace"`
}

type coreConf struct {
	Apps struct {
		Sources struct {
			Twilio struct {
				AuthToken  string `yaml:"authToken"`
				AccountSid string `yaml:"accountSid"`
			}
			Facebook struct {
				AppID         string `yaml:"appId"`
				AppSecret     string `yaml:"appSecret"`
				WebhookSecret string `yaml:"webhookSecret"`
			}
			Google struct {
				PartnerKey string `yaml:"partnerKey"`
				SaFile     string `yaml:"saFile"`
			}
		}
		Webhooks struct {
			Name string `yaml:"name"`
		}
	}
}

type airyConf struct {
	Global globalConf
	Core   coreConf
}

func parseConf(configFile string) (airyConf, error) {
	data, err := ioutil.ReadFile(configFile)
	if err != nil {
		fmt.Println("error reading configuration file: ", err)
		os.Exit(1)
	}

	conf := airyConf{
		Global: globalConf{
			Namespace: "default",
		},
	}

	err = yaml.Unmarshal(data, &conf)
	if err != nil {
		fmt.Println("error parsing configuration file: ", err)
		os.Exit(1)
	}

	return conf, nil
}
