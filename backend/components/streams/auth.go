package main

import (
	"context"
	"encoding/base64"
	"log"
	"net/http"
	"regexp"
	"strings"

	"github.com/golang-jwt/jwt"
	"k8s.io/klog"
)

type EnableAuthMiddleware struct {
	pattern *regexp.Regexp
}

// MustNewAuthMiddleware Only paths that match the regexp pattern will be authenticated
func MustNewAuthMiddleware(pattern string) EnableAuthMiddleware {
	r, err := regexp.Compile(pattern)
	if err != nil {
		log.Fatal(err)
	}
	return EnableAuthMiddleware{pattern: r}
}

func (a EnableAuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		if !a.pattern.MatchString(r.URL.Path) {
			next.ServeHTTP(w, r)
			return
		}

		// Auth middlewares attach a flag to the context indicating that authentication was successful
		if val, ok := ctx.Value("auth").(bool); ok && val {
			next.ServeHTTP(w, r)
		} else {
			http.Error(w, "Forbidden", http.StatusForbidden)
		}
	})
}

type SystemTokenMiddleware struct {
	systemToken string
}

func NewSystemTokenMiddleware(systemToken string) SystemTokenMiddleware {
	return SystemTokenMiddleware{systemToken: systemToken}
}

func (s SystemTokenMiddleware) Middleware(next http.Handler) http.Handler {
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

func NewJwtMiddleware(jwtSecret string) JwtMiddleware {
	data, err := base64.StdEncoding.DecodeString(jwtSecret)
	if err != nil {
		klog.Fatal("failed to base64 decode jwt secret: ", err)
	}

	return JwtMiddleware{jwtSecret: data}
}

func (j JwtMiddleware) Middleware(next http.Handler) http.Handler {
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
