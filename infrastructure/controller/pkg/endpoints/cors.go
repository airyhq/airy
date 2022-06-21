package endpoints

import (
	"net/http"
	"strings"
)

type CORS struct {
	allowedOrigins map[string]struct{}
}

func NewCORSMiddleware(allowedOrigins string) CORS {
	cors := CORS{allowedOrigins: make(map[string]struct{})}

	for _, origin := range strings.Split(allowedOrigins, ",") {
		cors.allowedOrigins[origin] = struct{}{}
	}

	return cors
}

func (c *CORS) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		origin := r.Header.Get("Origin")
		_, allowed := c.allowedOrigins[origin]

		if !allowed && r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusForbidden)
			return
		}

		if allowed {
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "POST, GET")
			w.Header().Set(
				"Access-Control-Allow-Headers",
				"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, X-Requested-With, X-XSRF-Token",
			)
		}

		if r.Method == "OPTIONS" {
			return
		}

		next.ServeHTTP(w, r)
	})
}
