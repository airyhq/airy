package main

import (
	"os/exec"
	"testing"

	airytests "cli/pkg/tests"
	"reflect"
)

const binaryName = "./airy"

func TestCli(t *testing.T) {
	tests := []struct {
		name    string
		args    []string
		golden  string
		wantErr bool
	}{
		{"no args", []string{}, "cli.no-args", false},
		{"login", []string{"api", "login", "--config", "pkg/tests/golden/cli.yaml"}, "cli.login", false},
		{"version", []string{"version", "--config", "pkg/tests/golden/cli.yaml"}, "cli.version", false},
	}

	go func() {
		airytests.MockServer()
	}()

	for _, tt := range tests {
		t.Run(tt.name, func(testing *testing.T) {
			cmd := exec.Command(binaryName, tt.args...)
			output, err := cmd.CombinedOutput()
			actual := string(output)
			if (err != nil) != tt.wantErr {
				t.Fatalf("Test %s expected to fail: %t. Did the test pass: %t. Error message: %v Output: %s\n", tt.name, tt.wantErr, err == nil, err, actual)
			}
			golden := airytests.NewGoldenFile(t, tt.golden)
			expected := golden.Load()

			if !reflect.DeepEqual(actual, expected) {
				t.Fatalf("diff: %v", airytests.Diff(actual, expected))
			}

		})

	}
}
