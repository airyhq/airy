package tests

import (
	"io/ioutil"
	"os"
	"path/filepath"
	"testing"

	"github.com/kr/pretty"
)

// TestFile struct
type TestFile struct {
	t    *testing.T
	name string
	dir  string
}

// Diff function
func Diff(expected, actual interface{}) []string {
	return pretty.Diff(expected, actual)
}

// NewGoldenFile function
func NewGoldenFile(t *testing.T, name string) *TestFile {
	return &TestFile{t: t, name: name, dir: "./pkg/tests/golden/"}
}

func (tf *TestFile) path() string {
	tf.t.Helper()
	return filepath.Join(tf.dir, tf.name)
}

func (tf *TestFile) write(content string) {
	tf.t.Helper()
	err := ioutil.WriteFile(tf.path(), []byte(content), 0644)
	if err != nil {
		tf.t.Fatalf("could not write %s: %v", tf.name, err)
	}
}

func (tf *TestFile) asFile() *os.File {
	tf.t.Helper()
	file, err := os.Open(tf.path())
	if err != nil {
		tf.t.Fatalf("could not open %s: %v", tf.name, err)
	}
	return file
}

// Load method
func (tf *TestFile) Load() string {
	tf.t.Helper()

	content, err := ioutil.ReadFile(tf.path())
	if err != nil {
		tf.t.Fatalf("could not read file %s: %v", tf.name, err)
	}

	return string(content)
}
