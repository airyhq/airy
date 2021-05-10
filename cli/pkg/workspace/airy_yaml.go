package workspace

type KubernetesConf struct {
	AppImageTag             string      `yaml:"appImageTag"`
	ContainerRegistry       string      `yaml:"containerRegistry"`
	Namespace               string      `yaml:"namespace"`
	NgrokEnabled            string      `yaml:"ngrokEnabled"`
	Host                    string      `yaml:"host"`
	LoadBalancerAnnotations interface{} `yaml:"loadBalancerAnnotations"`
}

type componentsConf map[string]map[string]string

type AiryConf struct {
	Kubernetes KubernetesConf
	Security   SecurityConf
	Components map[string]componentsConf
}

type SecurityConf struct {
	SystemToken    string            `yaml:"systemToken"`
	AllowedOrigins string            `yaml:"allowedOrigins"`
	JwtSecret      string            `yaml:"jwtSecret"`
	Oidc           map[string]string `yaml:"oidc"`
}
