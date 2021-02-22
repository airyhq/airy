package main

import (
	"flag"
	"io/ioutil"
	"log"
	"os"
)

func main() {
	log.SetFlags(0)
	dryRun := *flag.Bool("dry_run", true, "Print to stdout instead of writing files")
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
	} else {
		if err = ioutil.WriteFile("go.mod", fileContent, 644); err != nil {
			log.Fatal(err)
		}
	}

	// run gazelle update-repos on virtual go.mod

	// cleanup

}
