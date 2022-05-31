package workspace

import (
	"io/ioutil"
	"path/filepath"

	"github.com/airyhq/airy/lib/go/config"

	"gopkg.in/yaml.v2"
)

const cliConfigFileName = "cli.yaml"

type ConfigDir struct {
	Path string
}

func (f ConfigDir) GetAiryYaml() string {
	return filepath.Join(f.Path, "airy.yaml")
}

func (f ConfigDir) LoadAiryYaml() (config.AiryConf, error) {
	data, err := ioutil.ReadFile(f.GetAiryYaml())
	if err != nil {
		return config.AiryConf{}, err
	}
	conf := config.AiryConf{}
	err = yaml.Unmarshal(data, &conf)
	return conf, err
}

func (f ConfigDir) UpdateAiryYaml(apply func(config.AiryConf) config.AiryConf) error {
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

func (f ConfigDir) GetPath(fileName string) string {
	return filepath.Join(f.Path, fileName)
}
