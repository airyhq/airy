package config

func GetSecurityData(s SecurityConf) map[string]string {
	m := make(map[string]string, len(s.Oidc))

	if s.SystemToken != "" {
		m["systemToken"] = s.SystemToken
	}
	if s.AllowedOrigins != "" {
		m["allowedOrigins"] = s.AllowedOrigins
	}
	if s.JwtSecret != "" {
		m["jwtSecret"] = s.JwtSecret
	}

	for key, value := range s.Oidc {
		if value != "" {
			m["oidc."+key] = value
		}
	}

	return m
}
