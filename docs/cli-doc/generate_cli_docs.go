package main

import (
	"cli/cmd"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra/doc"

	"fmt"
)

var ProjectDir string

const fmTemplate = `---
title: %s
sidebar_label: %s
---

`

func defaultLinkHandler(name, ref string) string {
	return fmt.Sprintf("`%s <%s.rst>`_", name, ref)
}

func main() {

	filePrepender := func(filename string) string {
		title := strings.Title(strings.Replace(strings.ReplaceAll(filepath.Base(filename), "_", " "), ".md", "", 1))
		return fmt.Sprintf(fmTemplate, title, title)
	}
	identity := func(s string) string { return s }

	cmd.RootCmd.DisableAutoGenTag = true

	err := doc.GenMarkdownTreeCustom(cmd.RootCmd, ProjectDir+"/docs/docs/cli", filePrepender, identity)
	if err != nil {
		fmt.Println(err)
	}

}
