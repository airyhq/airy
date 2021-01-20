package integration

import (
	"os/exec"
	"testing"

	"reflect"
)

func TestApiLogin(t *testing.T) {
	tests := []struct {
		name    string
		args    []string
		golden  string
		wantErr bool
	}{
		{"login", []string{"api", "login", "--config", "golden/cli.yaml"}, "cli.login", false},
	}
	ms := NewMockServer(t)

	go func() {
		ms.Serve()
	}()

	for _, tt := range tests {
		t.Run(tt.name, func(testing *testing.T) {
			cmd := exec.Command(binaryName, append(tt.args, "--apihost", ms.Host)...)
			output, err := cmd.CombinedOutput()
			actual := string(output)
			if (err != nil) != tt.wantErr {
				if tt.wantErr {
					t.Fatalf("Test %s expected to fail but did not. Error message: %v Output: %s\n", tt.name, err, actual)
				} else {
					t.Fatalf("Test %s expected to pass but did not. Error message: %v Output: %s\n", tt.name, err, actual)
				}
			}
			golden := NewGoldenFile(t, tt.golden)
			expected := golden.Load()

			if !reflect.DeepEqual(actual, expected) {
				t.Fatalf("diff: %v", Diff(actual, expected))
			}

		})

	}
}
