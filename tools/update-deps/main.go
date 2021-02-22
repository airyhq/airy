package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"
	"os/exec"
)

func main() {
	log.SetFlags(0)

	var dryRun bool
	flag.BoolVar(&dryRun,"dry_run", false, "Print to stdout instead of writing files")
	flag.Parse()

	err := os.Chdir(os.Getenv("BUILD_WORKSPACE_DIRECTORY"))
	if err != nil {
		log.Fatal(err)
	}

	packages := flag.Args()
	if len(packages) == 0 {
		packages = FindModules("./", "")
		log.Printf("Found %v go.mod files to merge: %v", len(packages), packages)
	}

	targetModule := LoadModule("go.mod")

	modules := LoadModules(packages)

	targetModule = MergeModules(targetModule, modules)

	fileContent, err := targetModule.Format()
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
}
