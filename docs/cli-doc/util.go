package main

import (
	"bufio"

	"github.com/spf13/cobra"
)

type byName []*cobra.Command

func (s byName) Len() int           { return len(s) }
func (s byName) Swap(i, j int)      { s[i], s[j] = s[j], s[i] }
func (s byName) Less(i, j int) bool { return s[i].Name() < s[j].Name() }

func printOptions(w *bufio.Writer, cmd *cobra.Command, name string) error {
	flags := cmd.NonInheritedFlags()
	flags.SetOutput(w)
	if flags.HasAvailableFlags() {
		w.WriteString("#### Options\n\n```\n")
		flags.PrintDefaults()
		w.WriteString("```\n\n")
	}

	parentFlags := cmd.InheritedFlags()
	parentFlags.SetOutput(w)
	if parentFlags.HasAvailableFlags() {
		w.WriteString("#### Options inherited from parent commands\n\n```\n")
		parentFlags.PrintDefaults()
		w.WriteString("```\n\n")
	}
	return nil
}
