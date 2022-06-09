package payloads

type Service struct {
	Enabled   bool   `json:"enabled"`
	Healthy   bool   `json:"healthy"`
	Component string `json:"component"`
}

type ClientConfigResponsePayload struct {
	Services    map[string]Service `json:"services"`
	UserProfile map[string]string  `json:"user_profile"`
}
