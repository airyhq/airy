package main

import (
	"golang.org/x/mod/modfile"
	"golang.org/x/mod/semver"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"
)

type SourceModule struct {
	Path   string
	Module modfile.File
}

func FindSourceModules(rootPath string) []string {
	paths := make([]string, 0)

	err := filepath.Walk(rootPath, func(path string, f os.FileInfo, err error) error {
		// Exclude the root go mod
		if filepath.Base(path) == "go.mod" && path != "go.mod" {
			paths = append(paths, path)
		}
		return nil
	})

	if err != nil {
		log.Fatal(err)
	}

	return paths
}

func LoadModules(paths []string) []SourceModule {
	modules := make([]SourceModule, 0)
	for _, path := range paths {
		modules = append(modules, SourceModule{
			Path:   path,
			Module: LoadModule(path),
		})
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

// Merge all require statements from the modules list into the target module
// Pick the latest version encountered for each package
func MergeModuleRequire(targetModule modfile.File, sourceModule modfile.File) modfile.File {
	for _, require := range sourceModule.Require {
		// Skip paths within the same repository because gazelle cannot use them
		if strings.HasPrefix(require.Mod.Path, targetModule.Module.Mod.Path) {
			continue
		}

		need := true
		for _, existingRequire := range targetModule.Require {
			if require.Mod.Path != existingRequire.Mod.Path {
				continue
			}

			if semver.Compare(require.Mod.Version, existingRequire.Mod.Version) == 1 {
				if err := targetModule.AddRequire(require.Mod.Path, require.Mod.Version); err != nil {
					log.Fatal(err)
				}
			}
			need = false
		}

		if need == true {
			targetModule.AddNewRequire(require.Mod.Path, require.Mod.Version, require.Indirect)
		}
	}

	return targetModule
}

// Update the require and version statements in each module with the source module
func UpdateModule(targetModule modfile.File, sourceModule modfile.File) (bool, modfile.File) {
	modified := false
	for _, require := range sourceModule.Require {
		for _, existingRequire := range targetModule.Require {
			if require.Mod.Path == existingRequire.Mod.Path && require.Mod.Version != existingRequire.Mod.Version {
				modified = true
				if err := targetModule.AddRequire(require.Mod.Path, require.Mod.Version); err != nil {
					log.Fatal(err)
				}
			}
		}
	}

	if targetModule.Go == nil || targetModule.Go.Version != sourceModule.Go.Version {
		modified = true
		if err := targetModule.AddGoStmt(sourceModule.Go.Version); err != nil {
			log.Fatal()
		}
	}

	return modified, targetModule
}
