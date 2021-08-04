package template

import (
	"embed"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"

	"github.com/Masterminds/sprig"
)

type Variables struct {
	NgrokEnabled            bool
	Version                 string
	Namespace               string
	Host                    string
	LoadbalancerAnnotations map[string]string
	Https                   bool
	LetsencryptEmail        string
}

//go:embed src
var templateDir embed.FS

func CopyToDir(path string, data Variables) error {
	entries, err := templateDir.ReadDir("src")
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if err := recCopy(path, "src", entry, data); err != nil {
			return err
		}
	}
	return nil
}

// Recursively copies and templates entries to the workspace
func recCopy(writePath string, templatePath string, entry fs.DirEntry, data Variables) error {
	dstPath := filepath.Join(writePath, entry.Name())
	templatePath = filepath.Join(templatePath, entry.Name())

	if !entry.IsDir() {
		content, err := templateDir.ReadFile(filepath.ToSlash(templatePath))
		if err != nil {
			return err
		}
		if _, err := os.Stat(dstPath); err == nil {
			// User already has provided this file so we don't overwrite it
			return nil
		}

		tmpl, err := template.New(entry.Name()).Funcs(sprig.FuncMap()).Parse(string(content))
		if err != nil {
			return err
		}

		f, err := os.Create(dstPath)
		if err != nil {
			return err
		}

		return tmpl.Execute(f, data)
	}

	if err := os.MkdirAll(dstPath, 0700); err != nil {
		return err
	}
	entries, err := templateDir.ReadDir(templatePath)
	if err != nil {
		return err
	}

	for _, entry := range entries {
		if err := recCopy(dstPath, templatePath, entry, data); err != nil {
			return err
		}
	}

	return nil
}
