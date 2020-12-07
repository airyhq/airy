package main

type SignupRequestPayload struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Password  string `json:"password"`
	Email     string `json:"email"`
}

type SignupResponsePayload struct {
	ID        string
	FirstName string
	LastName  string
	Token     string
}

type loginRequestPayload struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type loginResponsePayload struct {
	ID        string
	FirstName string
	LastName  string
	Token     string
}
