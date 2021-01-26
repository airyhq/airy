package integration

import (
	"testing"
)

func TestVersion(t *testing.T) {
	tests := []test{
		{"version", []string{"version", "--cli-config", "golden/cli.yaml"}, "cli.version", false},
	}

	runner(t, tests)
}
