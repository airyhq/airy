package config

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
	SystemToken    string            `yaml:"systemToken,omitempty" json:"system_token,omitempty"`
	AllowedOrigins string            `yaml:"allowedOrigins" json:"allowed_origins"`
	JwtSecret      string            `yaml:"jwtSecret" json:"jwt_secret"`
	Oidc           map[string]string `yaml:"oidc,omitempty" json:"oidc,omitempty"`
}

type ComponentsConf map[string]map[string]string

type AiryConf struct {
	Global     GlobalConf                `yaml:"global"`
	Ingress    IngressConf               `yaml:"ingress"`
	Security   SecurityConf              `yaml:"security"`
	Components map[string]ComponentsConf `yaml:"components,omitempty"`
}

type ClusterConfig struct {
	Security SecurityConf `json:"security"`
}
