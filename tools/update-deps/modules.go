package main

import (
	"golang.org/x/mod/modfile"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
)

type Module struct {
	File *modfile.File
	Path string
}

func FindModules(rootPath string, excludePattern string) []string {
	paths := make([]string, 0)

	filepath.Walk(rootPath, func(path string, f os.FileInfo, err error) error {
		matches, err := filepath.Match(excludePattern, path)
		if err != nil {
			log.Fatal(err)
		}

		if matches {
			return filepath.SkipDir
		}

		if filepath.Base(path) == "go.mod" {
			paths = append(paths, path)
		}
		return nil
	})

	return paths
}

func LoadModules(paths []string) []modfile.File {
	modules := make([]modfile.File, 0)
	for _, path := range paths {
		modules = append(modules, LoadModule(path))
	}

	return modules
}

func LoadModule(path string) modfile.File {
	data, err := ioutil.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}

	file, parseErr := modfile.Parse("go.mod", data, nil)
	if parseErr != nil {
		log.Fatal(parseErr)
	}
	return *file
}

func MergeModules(targetModule modfile.File, modules []modfile.File) modfile.File {
	targetModule.SetRequire(make([]*modfile.Require, 0))

	for _, file := range modules {
		for _, require := range file.Require {
			if err := targetModule.AddRequire(require.Mod.Path, require.Mod.Version); err != nil {
				log.Fatal(err)
			}
		}
	}

	return targetModule
}
