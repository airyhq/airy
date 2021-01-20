module cli

go 1.12

require (
	github.com/airyhq/airy/lib/go/httpclient v0.0.0
	github.com/kr/pretty v0.2.1
	github.com/mitchellh/go-homedir v1.1.0
	github.com/spf13/cobra v1.1.1
	github.com/spf13/viper v1.7.1
	goji.io v2.0.2+incompatible
)

replace github.com/airyhq/airy/lib/go/httpclient => ../../lib/go/httpclient
