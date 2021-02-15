package main

import (
	"bufio"
	"cli/cmd"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/spf13/cobra"

	"fmt"
)

var ProjectDir string

const fmTemplate = `---
title: %s
sidebar_label: %s
---

`

const basename = "reference"

func main() {

	dir := ProjectDir + "/docs/docs/cli"

	filename := filepath.Join(dir, basename+".md")
	f, err := os.Create(filename)
	if err != nil {
		fmt.Println(err)
	}
	defer f.Close()
	w := bufio.NewWriter(f)

	title := strings.Title(basename)
	w.WriteString(fmt.Sprintf(fmTemplate, title, "CLI "+title))

	err = genMarkdownTreeCustom(cmd.RootCmd, w)
	if err != nil {
		fmt.Println(err)
	}

}

func genMarkdownTreeCustom(cmd *cobra.Command, w *bufio.Writer) error {

	subcommands := cmd.Commands()
	sort.Sort(byName(subcommands))

	if err := genMarkdownCustom(cmd, w); err != nil {
		return err
	}

	for _, c := range subcommands {
		if !c.IsAvailableCommand() || c.IsAdditionalHelpTopicCommand() {
			continue
		}
		if err := genMarkdownTreeCustom(c, w); err != nil {
			return err
		}
	}

	return nil
}

func genMarkdownCustom(cmd *cobra.Command, w *bufio.Writer) error {
	cmd.InitDefaultHelpCmd()
	cmd.InitDefaultHelpFlag()

	name := cmd.CommandPath()

	w.WriteString("## " + name + "\n\n")
	w.WriteString(cmd.Short + "\n\n")
	if len(cmd.Long) > 0 {
		w.WriteString("#### Synopsis\n\n")
		w.WriteString(cmd.Long + "\n\n")
	}

	if cmd.Runnable() {
		w.WriteString(fmt.Sprintf("```\n%s\n```\n\n", cmd.UseLine()))
	}

	if len(cmd.Example) > 0 {
		w.WriteString("#### Examples\n\n")
		w.WriteString(fmt.Sprintf("```\n%s\n```\n\n", cmd.Example))
	}

	if err := printOptions(w, cmd, name); err != nil {
		return err
	}
	if hasSeeAlso(cmd) {
		w.WriteString("#### SEE ALSO\n\n")
		if cmd.HasParent() {
			parent := cmd.Parent()
			pname := parent.CommandPath()
			link := basename + "#" + pname
			link = strings.Replace(link, " ", "-", -1)
			w.WriteString(fmt.Sprintf("* [%s](%s)\t - %s\n", pname, link, parent.Short))
			cmd.VisitParents(func(c *cobra.Command) {
			})
		}

		subcommands := cmd.Commands()
		sort.Sort(byName(subcommands))

		for _, child := range subcommands {
			if !child.IsAvailableCommand() || child.IsAdditionalHelpTopicCommand() {
				continue
			}
			cname := name + " " + child.Name()
			link := basename + "#" + cname
			link = strings.Replace(link, " ", "-", -1)
			w.WriteString(fmt.Sprintf("* [%s](%s)\t - %s\n", cname, link, child.Short))
		}
	}

	w.WriteString("\n")
	w.WriteString("***\n\n")
	w.Flush()
	return nil
}
