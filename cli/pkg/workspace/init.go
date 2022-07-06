package workspace

import (
	"cli/pkg/workspace/template"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/viper"
)

func Init(path string) (ConfigDir, error) {
	viper.AddConfigPath(getConfigPath(path))
	viper.SetConfigType("yaml")
	viper.SetConfigName(cliConfigFileName)

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			err = fmt.Errorf("%w\nthe current directory is not an airy workspace directory", err)
		} else {
			err = fmt.Errorf("invalid configuration: %w", err)
		}

		return ConfigDir{}, err
	}

	dir := ConfigDir{Path: path}

	if _, err := os.Stat(dir.GetAiryYaml()); os.IsNotExist(err) {
		return dir, fmt.Errorf("the current directory is not an airy workspace directory")
	}
	return dir, nil
}

func getConfigPath(path string) string {
	if path == "" {
		path = "."
	} else if filepath.IsAbs(path) {
		return path
	}

	path, err := filepath.Abs(path)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	return path
}

func Create(path string, data template.Variables, providerName string) (ConfigDir, error) {
	path = getConfigPath(path)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err = os.MkdirAll(path, 0755)
		if err != nil {
			return ConfigDir{}, err
		}
	}

	if err := template.CopyToDir(path, data); err != nil {
		return ConfigDir{}, err
	}

	viper.AddConfigPath(getConfigPath(path))
	viper.SetConfigType("yaml")
	viper.SetConfigName(cliConfigFileName)
	// Init viper config
	err := viper.WriteConfigAs(filepath.Join(path, cliConfigFileName))

	if err != nil {
		return ConfigDir{}, err
	}
	return ConfigDir{Path: path}, err
}
