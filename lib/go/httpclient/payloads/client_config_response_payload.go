package payloads

type ClientConfigResponsePayload struct {
	Components map[string]interface{} `json:"components"`
	Features   map[string]interface{} `json:"features"`
}
