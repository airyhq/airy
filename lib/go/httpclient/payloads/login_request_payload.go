package payloads

type LoginRequestPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}
