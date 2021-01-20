package payloads

type ClientConfigResponsePayload struct {
	Components map[string]map[string]interface{} `json:"components"`
	Features   map[string]string                 `json:"features"`
}
