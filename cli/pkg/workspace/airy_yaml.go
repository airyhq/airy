package workspace

type IngressConf struct {
	NgrokEnabled            bool              `yaml:"ngrokEnabled"`
	Https                   bool              `yaml:"https,omitempty"`
	Host                    string            `yaml:"host,omitempty"`
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
	Ingress    IngressConf               `yaml:"ingress"`
	Security   SecurityConf              `yaml:"security"`
	Components map[string]ComponentsConf `yaml:"components,omitempty"`
}
