package main

import (
	"flag"
	"fmt"
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
		log.Printf("Found %v go.mod files to merge:", len(packages))
		for _, pkg := range packages {
			fmt.Println("\t", pkg)
		}
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

	out, err := exec.Command("go", "get", ".").CombinedOutput()
	if err != nil {
		log.Fatal(string(out))
	}
	log.Println("Installed packages")
	log.Println("Updating go.sum using go get")

	out, err = exec.Command("bazel", "run", "//:gazelle", "--", "update-repos",
		"-from_file=go.mod", "-prune", "-build_file_proto_mode=disable_global", "-to_macro=go_repositories.bzl%go_repositories").CombinedOutput()
	if err != nil {
		log.Fatal(string(out))
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

		if out, err = exec.Command("go", "get", "-v", ".").CombinedOutput(); err != nil {
			log.Fatal(string(out))
		}

		log.Printf("Modified %v", sourceModule.Path)
		if err = os.Chdir(workingDir); err != nil {
			log.Fatal(err)
		}
	}
}
