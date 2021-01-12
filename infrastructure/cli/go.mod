module cli

go 1.12

require (
	github.com/BurntSushi/toml v0.3.1 // indirect
	github.com/airyhq/airy/lib/go/httpclient v0.0.0
	github.com/armon/consul-api v0.0.0-20180202201655-eb2c6b5be1b6 // indirect
	github.com/coreos/go-etcd v2.0.0+incompatible // indirect
	github.com/inconshreveable/mousetrap v1.0.0 // indirect
	github.com/kr/pretty v0.2.1
	github.com/mitchellh/go-homedir v1.1.0
	github.com/spf13/cobra v1.1.1
	github.com/spf13/viper v1.7.1
	github.com/ugorji/go/codec v0.0.0-20181204163529-d75b2dcb6bc8 // indirect
	github.com/xordataexchange/crypt v0.0.3-0.20170626215501-b2862e3d0a77 // indirect
	goji.io v2.0.2+incompatible
)

replace github.com/airyhq/airy/lib/go/httpclient => ../../lib/go/httpclient
