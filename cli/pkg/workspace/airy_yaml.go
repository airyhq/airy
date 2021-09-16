package workspace

type KubernetesConf struct {
	AppImageTag       string `yaml:"appImageTag"`
	ContainerRegistry string `yaml:"containerRegistry"`
	Namespace         string `yaml:"namespace"`
	NgrokEnabled      bool   `yaml:"ngrokEnabled"`
}

type IngressConf struct {
	Host                    string            `yaml:"host,omitempty"`
	Https                   bool              `yaml:"https,omitempty"`
	LetsencryptEmail        string            `yaml:"letsencryptEmail,omitempty"`
	LoadbalancerAnnotations map[string]string `yaml:"loadbalancerAnnotations,omitempty"`
}

type SecurityConf struct {
	SystemToken    string            `yaml:"systemToken,omitempty"`
	AllowedOrigins string            `yaml:"allowedOrigins"`
	JwtSecret      string            `yaml:"jwtSecret"`
	Oidc           map[string]string `yaml:"oidc,omitempty"`
}
type ComponentsConf map[string]map[string]string

type AiryConf struct {
	Kubernetes KubernetesConf            `yaml:"kubernetes"`
	Ingress    IngressConf               `yaml:"ingress"`
	Security   SecurityConf              `yaml:"security"`
	Components map[string]ComponentsConf `yaml:"components,omitempty"`
}

type HelmAiryConf struct {
	Global AiryConf `yaml:"global"`
}
