package workspace

import (
	"fmt"
	"github.com/spf13/viper"
	"io/fs"
	"io/ioutil"
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


func Create(path string) (ConfigDir, error) {
	path = getConfigPath(path)
	if _, err := os.Stat(path); os.IsNotExist(err) {
		err = os.MkdirAll(path, 0755)
		if err != nil {
			return ConfigDir{}, err
		}
	}

	entries, err := templateDir.ReadDir("template")
	if err != nil {
		return ConfigDir{}, err
	}

	for _, entry := range entries {
		if err := recCopy(path, "template", entry); err != nil {
			return ConfigDir{}, err
		}
	}

	// Init viper config
	err = viper.WriteConfigAs(filepath.Join(path, cliConfigFileName))
	viper.AddConfigPath(getConfigPath(path))
	viper.SetConfigType("yaml")
	viper.SetConfigName(cliConfigFileName)

	return ConfigDir{Path: path}, err
}

func recCopy(writePath string, templatePath string, entry fs.DirEntry) error {
	dstPath := filepath.Join(writePath, entry.Name())
	templatePath = filepath.Join(templatePath, entry.Name())

	if !entry.IsDir() {
		content, err := templateDir.ReadFile(templatePath)
		if err != nil {
			return err
		}

		return ioutil.WriteFile(dstPath, content, 0700)
	}

	if err := os.MkdirAll(dstPath, 0700); err != nil {
		return err
	}

	entries, err := templateDir.ReadDir(templatePath)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if err := recCopy(dstPath, templatePath, entry); err != nil {
			return err
		}
	}

	return nil
}
