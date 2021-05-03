package workspace

import (
	"path/filepath"
)

const cliConfigFileName = "cli.yaml"

type ConfigDir struct {
	Path string
}

func (f ConfigDir) GetAiryYaml() string {
	return filepath.Join(f.Path, "airy.yaml")
}

func (f ConfigDir) GetPath(fileName string) string {
	return filepath.Join(f.Path, fileName)
}
