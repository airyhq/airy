module cli

go 1.16

require (
	github.com/Masterminds/goutils v1.1.1 // indirect
	github.com/Masterminds/semver v1.5.0 // indirect
	github.com/Masterminds/sprig v2.22.0+incompatible
	github.com/TwinProduction/go-color v1.0.0
	github.com/airyhq/airy/lib/go/httpclient v0.0.0
	github.com/aws/aws-sdk-go v1.37.29
	github.com/aws/aws-sdk-go-v2/config v1.1.1
	github.com/aws/aws-sdk-go-v2/service/ec2 v1.1.1
	github.com/aws/aws-sdk-go-v2/service/eks v1.1.1
	github.com/aws/aws-sdk-go-v2/service/iam v1.1.1
	github.com/huandu/xstrings v1.3.2 // indirect
	github.com/imdario/mergo v0.3.11 // indirect
	github.com/kr/pretty v0.2.1
	github.com/mitchellh/copystructure v1.1.2 // indirect
	github.com/mitchellh/go-homedir v1.1.0
	github.com/spf13/cast v1.3.1 // indirect
	github.com/spf13/cobra v1.1.1
	github.com/spf13/viper v1.7.1
	github.com/thanhpk/randstr v1.0.4
	github.com/txn2/txeh v1.3.0
	goji.io v2.0.2+incompatible
	gopkg.in/yaml.v2 v2.4.0
	k8s.io/api v0.19.0
	k8s.io/apimachinery v0.19.0
	k8s.io/client-go v0.19.0
)

replace github.com/airyhq/airy/lib/go/httpclient => ../lib/go/httpclient
