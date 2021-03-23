package handler

const (
	// ConfigmapEnvVarPostfix is a postfix for configmap envVar
	ConfigmapEnvVarPostfix = "CONFIGMAP"
	// SecretEnvVarPostfix is a postfix for secret envVar
	SecretEnvVarPostfix = "SECRET"
)

//Config contains rolling upgrade configuration parameters
type Config struct {
	Namespace string
	Name      string
	SHAValue  string
	Type      string
}
