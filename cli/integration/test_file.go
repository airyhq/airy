package integration

import (
	"embed"
	"testing"

	"github.com/kr/pretty"
)

//go:embed golden
var goldenDir embed.FS

// TestFile struct
type TestFile struct {
	t    *testing.T
	name string
}

// Diff function
func Diff(expected, actual interface{}) []string {
	return pretty.Diff(expected, actual)
}

// NewGoldenFile function
func NewGoldenFile(t *testing.T, name string) *TestFile {
	return &TestFile{t: t, name: name + ".golden"}
}

// Load method
func (tf *TestFile) Load() string {
	tf.t.Helper()

	content, err := goldenDir.ReadFile(tf.name)
	if err != nil {
		tf.t.Fatalf("test file not found %s: %v", tf.name, err)
	}

	return string(content)
}
