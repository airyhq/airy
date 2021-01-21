package integration

import (
	"io/ioutil"
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
	return &TestFile{t: t, name: name + ".golden", dir: "./golden/"}
}

func (tf *TestFile) path() string {
	tf.t.Helper()
	return filepath.Join(tf.dir, tf.name)
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
