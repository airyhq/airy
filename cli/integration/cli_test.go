package integration

import (
	"io/ioutil"
	"path/filepath"
	"testing"
)

func TestCli(t *testing.T) {
	ms := NewMockServer(t)

	go func() {
		ms.Serve()
	}()

	cwdPath, err := filepath.Abs(".")
	dir, err := ioutil.TempDir(cwdPath, "config-dir")
	if err != nil {
		t.Fatal(err)
	}

	out, err := runCLI([]string{"create", "--init-only", "--provider=minikube", dir})
	if err != nil {
		t.Fatal(out, err)
	}
	// overwrite the default cli.yaml
	file, err := goldenDir.ReadFile("golden/cli.yaml")
	if err != nil {
		t.Fatal(err)
	}
	if err = ioutil.WriteFile(filepath.Join(dir, "cli.yaml"), file, 0700); err != nil {
		t.Fatal(err)
	}
	tests := []test{
		{"login", []string{"--config-dir", dir, "api", "login", "--apihost", ms.Host}, "cli.login", false},
		{"no args", []string{}, "cli.no-args", false},
	}

	runner(t, tests)
}
