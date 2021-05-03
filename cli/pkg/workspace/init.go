package workspace

import (
	"cli/pkg/workspace/template"
	"fmt"
	"github.com/spf13/viper"
	"os"
	"path/filepath"
)

func Init(path string) ConfigDir {
	viper.AddConfigPath(getConfigPath(path))
	viper.SetConfigType("yaml")
	viper.SetConfigName(cliConfigFileName)

	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); ok {
			fmt.Println(err)
			fmt.Println("the current directory is not an airy config directory")
		} else {
			fmt.Println("invalid configuration: ", err)
		}

		os.Exit(1)
	}

	dir := ConfigDir{Path: path}

	if _, err := os.Stat(dir.GetAiryYaml()); os.IsNotExist(err) {
		fmt.Println("the current directory is not an airy config directory")
		os.Exit(1)
	}
	return dir
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

func Create(path string, data template.Variables) (ConfigDir, error) {
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
	return ConfigDir{Path: path}, err
}
