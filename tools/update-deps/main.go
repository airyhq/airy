package main

import (
	"flag"
	"golang.org/x/mod/modfile"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	log.SetFlags(0)

	var dryRun bool
	flag.BoolVar(&dryRun, "dry_run", false, "Print to stdout instead of writing files")
	flag.Parse()

	workingDir := os.Getenv("BUILD_WORKSPACE_DIRECTORY")
	err := os.Chdir(workingDir)
	if err != nil {
		log.Fatal(err)
	}

	packages := flag.Args()
	if len(packages) == 0 {
		packages = FindSourceModules("./")
		log.Printf("Found %v go.mod files to merge: %v", len(packages), packages)
	}

	rootModule := LoadModule("go.mod")

	modules := LoadModules(packages)

	rootModule.SetRequire(make([]*modfile.Require, 0))
	for _, sourceModule := range modules {
		rootModule = MergeModuleRequire(rootModule, sourceModule.Module)
	}

	fileContent, err := rootModule.Format()
	if err != nil {
		log.Fatal(err)
	}

	if dryRun == true {
		log.Println("Merged go.mod:\n---------------")
		log.Print(string(fileContent))
		os.Exit(0)
	} else {
		if err = ioutil.WriteFile("go.mod", fileContent, 644); err != nil {
			log.Fatal(err)
		}
		log.Println("Updated go.mod")
	}

	err = exec.Command("go", "get", ".").Start()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Installed packages and updating go.sum using go get")

	err = exec.Command("bazel", "run", "//:gazelle", "--", "-update-repos", "-from_file=go.mod", "-prune").Start()
	if err != nil {
		log.Fatal(err)
	}
	log.Println("Updated go_repositories.bzl with Gazelle")

	// Update the source go.mod files and their go.sums
	for _, sourceModule := range modules {
		modified, file := UpdateModule(sourceModule.Module, rootModule)
		if !modified {
			continue
		}

		content, err := file.Format()
		if err != nil {
			log.Fatal(err)
		}

		if err = ioutil.WriteFile(sourceModule.Path, content, 644); err != nil {
			log.Fatal(err)
		}

		if err = os.Chdir(filepath.Dir(sourceModule.Path)); err != nil {
			log.Fatal(err)
		}

		if err = exec.Command("go", "get", ".").Start(); err != nil {
			log.Fatal(err)
		}

		log.Printf("Modified %v", sourceModule.Path)
		os.Chdir(workingDir)
	}
}
