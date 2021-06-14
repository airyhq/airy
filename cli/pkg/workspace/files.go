package workspace

import (
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"path/filepath"
	"fmt"
	"encoding/json"
)

const cliConfigFileName = "cli.yaml"

type ConfigDir struct {
	Path string
}

func (f ConfigDir) GetAiryYaml() string {
	return filepath.Join(f.Path, "airy.yaml")
}

func (f ConfigDir) LoadAiryYaml() (AiryConf, error) {
	data, err := ioutil.ReadFile(f.GetAiryYaml())
	if err != nil {
		return AiryConf{}, err
	}
	conf := AiryConf{}
	err = yaml.Unmarshal(data, &conf)
	return conf, err
}

func (f ConfigDir) UpdateAiryYaml(apply func(AiryConf) AiryConf) error {
	airyYaml, err := f.LoadAiryYaml()
	if err != nil {
		return err
	}
	airyYaml = apply(airyYaml)
	out, err := yaml.Marshal(airyYaml)
	if err != nil {
		return err
	}

	return ioutil.WriteFile(f.GetAiryYaml(), out, 0644)
}

func (f ConfigDir) GetConnectorConfigs(connectorDir string) ([]Connector, error) {
	connectors := []Connector{}
	connectorsPath := f.GetPath(connectorDir)

		fileInfos, err := ioutil.ReadDir(connectorsPath)

		if err != nil {
			fmt.Print(err)
		}

		for _, file := range fileInfos {
			dat, err := ioutil.ReadFile(filepath.Join(connectorsPath, file.Name()))
			if err != nil {
				fmt.Println(err)

			}
			var connector Connector
			err = json.Unmarshal(dat, &connector)
			if err != nil {
				return nil, err
			}
			connectors = append(connectors, connector)
		}

	return connectors, nil
}

func (f ConfigDir) GetPath(fileName string) string {
	return filepath.Join(f.Path, fileName)
}
