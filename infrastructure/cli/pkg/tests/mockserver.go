package tests

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"goji.io"
	"goji.io/pat"
)

// MockServer starts the local server that returns the corresponding golden files for each endpoint
func MockServer() {
	mux := goji.NewMux()
	mux.HandleFunc(pat.Post("/users.signup"), mockUserSignupHandler)
	mux.HandleFunc(pat.Post("/users.login"), mockUserLoginHandler)

	log.Println("starting mock server on port localhost:3001")
	s := &http.Server{
		Addr:         ":3001",
		Handler:      mux,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}
	err := s.ListenAndServe()
	if err != nil {
		log.Println(err)
	}
}

func mockUserSignupHandler(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadFile("pkg/tests/golden/api.signup.golden")
	if err != nil {
		fmt.Fprint(w, err)
	}
	_, err = w.Write(data)
	if err != nil {
		log.Println(err)
	}
}

func mockUserLoginHandler(w http.ResponseWriter, r *http.Request) {
	data, err := ioutil.ReadFile("pkg/tests/golden/api.signup.golden")
	if err != nil {
		fmt.Fprint(w, err)
	}
	_, err = w.Write(data)
	if err != nil {
		log.Println(err)
	}
}
