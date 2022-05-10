package endpoints

import (
	"fmt"
	"github.com/golang-jwt/jwt"
	"k8s.io/klog"
	"net/http"
	"strings"
)

type AuthMiddleware struct {
	systemToken string
	jwtSecret   string
}

func NewAuthMiddleware(systemToken string, jwtSecret string) *AuthMiddleware {
	if systemToken == "" && jwtSecret == "" {
		klog.Fatal("systemToken and jwtSecret must be set")
	}
	return &AuthMiddleware{systemToken: systemToken, jwtSecret: jwtSecret}
}

func (a *AuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authPayload := r.Header.Get("Authorization")
		authPayload = strings.TrimPrefix(authPayload, "Bearer ")

		if authPayload == a.systemToken && a.systemToken != "" {
			next.ServeHTTP(w, r)
			return
		}

		token, err := jwt.Parse(authPayload, func(token *jwt.Token) (interface{}, error) {
			// Don't forget to validate the alg is what you expect:
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}

			return a.jwtSecret, nil
		})

		if _, ok := token.Claims.(jwt.MapClaims); ok && token.Valid && err != nil && a.jwtSecret != "" {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Forbidden", http.StatusForbidden)
		}
	})
}
