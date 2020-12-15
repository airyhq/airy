module cli

go 1.12

require (
	apiclient v0.0.0
	github.com/kr/pretty v0.2.1
	github.com/spf13/cobra v0.0.3
	github.com/spf13/viper v1.3.1
	goji.io v2.0.2+incompatible
)

replace apiclient => ../../lib/go/apiclient
