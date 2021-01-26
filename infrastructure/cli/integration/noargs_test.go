package integration

import (
	"testing"
)

func TestNoArgs(t *testing.T) {
	tests := []test{
		{"no args", []string{}, "cli.no-args", false},
	}

	go func() {
		ms := NewMockServer(t)
		ms.Serve()
	}()

	runner(t, tests)
}
