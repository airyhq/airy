package endpoints

import (
	"context"
	"github.com/golang-jwt/jwt"
	"log"
	"net/http"
	"strings"
)

func EnableAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if val, ok := ctx.Value("auth").(bool); ok && val == true {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Forbidden", http.StatusForbidden)
		}
	})
}

type SystemTokenMiddleware struct {
	systemToken string
}

func NewSystemTokenMiddleware(systemToken string) *SystemTokenMiddleware {
	return &SystemTokenMiddleware{systemToken: systemToken}
}

func (s *SystemTokenMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authPayload := r.Header.Get("Authorization")
		authPayload = strings.TrimPrefix(authPayload, "Bearer ")

		if authPayload == s.systemToken {
			ctx := context.WithValue(r.Context(), "auth", true)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}
		next.ServeHTTP(w, r)
	})
}

type JwtMiddleware struct {
	jwtSecret []byte
}

func NewJwtMiddleware(jwtSecret string) *JwtMiddleware {
	return &JwtMiddleware{jwtSecret: []byte(jwtSecret)}
}

func (j *JwtMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authPayload := r.Header.Get("Authorization")
		authPayload = strings.TrimPrefix(authPayload, "Bearer ")
		if authPayload == "" {
			authPayload = getAuthCookie(r)
		}

		token, err := jwt.Parse(authPayload, func(token *jwt.Token) (interface{}, error) {
			return j.jwtSecret, nil
		})

		if err != nil || !token.Valid {

			log.Printf("err: %v", err)
			log.Printf("token: %v", token)

			next.ServeHTTP(w, r)
			return
		}

		ctx := context.WithValue(r.Context(), "auth", true)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func getAuthCookie(r *http.Request) string {
	cookie, err := r.Cookie("airy_auth_token")
	if err != nil {
		return ""
	}
	return cookie.Value
}
