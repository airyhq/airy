package workspace

type KubernetesConf struct {
	AppImageTag             string            `yaml:"appImageTag"`
	ContainerRegistry       string            `yaml:"containerRegistry"`
	Namespace               string            `yaml:"namespace"`
	NgrokEnabled            string            `yaml:"ngrokEnabled"`
	Host                    string            `yaml:"host"`
	Https                   string            `yaml:"https,omitempty`
	LoadbalancerAnnotations map[string]string `yaml:"loadbalancerAnnotations,omitempty"`
	LetsencryptEmail        string            `yaml:"letsencryptEmail,omitempty`
}

type componentsConf map[string]map[string]string

type AiryConf struct {
	Kubernetes KubernetesConf            `yaml:"kubernetes"`
	Security   SecurityConf              `yaml:"security"`
	Components map[string]componentsConf `yaml:"components,omitempty"`
}

type SecurityConf struct {
	SystemToken    string            `yaml:"systemToken,omitempty"`
	AllowedOrigins string            `yaml:"allowedOrigins"`
	JwtSecret      string            `yaml:"jwtSecret"`
	Oidc           map[string]string `yaml:"oidc,omitempty"`
}
