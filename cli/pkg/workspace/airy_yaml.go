package workspace

type IngressGlobalConf struct {
	Lertsencrypt bool `yaml:"letsencrypt,omitempty"`
}

type GlobalConf struct {
	Host              string            `yaml:"host,omitempty"`
	IngressGlobalConf IngressGlobalConf `yaml:"ingress,omitempty"`
}

type IngressConf struct {
	NgrokEnabled            bool              `yaml:"ngrokEnabled"`
	Https                   bool              `yaml:"https,omitempty"`
	HttpsTermination        string            `yaml:"httpsTermination,omitempty"`
	HttpsCertificate        string            `yaml:"httpsCertificate,omitempty"`
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
	Global     GlobalConf                `yaml:"global"`
	Ingress    IngressConf               `yaml:"ingress"`
	Security   SecurityConf              `yaml:"security"`
	Components map[string]ComponentsConf `yaml:"components,omitempty"`
}
