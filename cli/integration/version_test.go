package integration

import (
	"regexp"
	"testing"
)

func TestVersion(t *testing.T) {
	actual, err := runCLI([]string{"version"})
	if err != nil {
		t.Error("expected version not to fail but did", err)
	}

	// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
	validVersionString := regexp.MustCompile(`Version: (develop|(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?), GitCommit: [0-9a-f]{5,40}\n$`)

	if !validVersionString.MatchString(actual) {
		t.Errorf("expected %s to be a valid version but was not", actual)
	}
}
