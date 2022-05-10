package main

import (
	"github.com/golang-jwt/jwt"
	"log"
	"testing"
)

// TODO For debugging, remove before merge
const token = ""
const key = ""

func TestSimple(t *testing.T) {

	token, err := jwt.Parse(token, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	log.Printf("err: %v", err)
	log.Printf("token: %v", token)

	if err != nil {
		t.Fatal("err was not nil")
	}
}
