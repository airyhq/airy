module cli

go 1.12

require (
	github.com/airyhq/airy/lib/go/httpclient v0.0.0
	github.com/airyhq/airy/lib/go/httpclient/payloads v0.0.0
	github.com/kr/pretty v0.2.1
	github.com/spf13/cobra v0.0.3
	github.com/spf13/viper v1.3.1
	goji.io v2.0.2+incompatible
)

replace github.com/airyhq/airy/lib/go/httpclient => ../../lib/go/httpclient
replace github.com/airyhq/airy/lib/go/httpclient/payloads => ../../lib/go/httpclient/payloads
