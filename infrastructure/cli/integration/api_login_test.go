package integration

import (
	"testing"
)

func TestApiLogin(t *testing.T) {
	ms := NewMockServer(t)

	go func() {
		ms.Serve()
	}()

	tests := []test{
		{"login", []string{"api", "login", "--apihost", ms.Host, "--cli-config", "golden/cli.yaml"}, "cli.login", false},
	}

	runner(t, tests)
}
