package main

import (
	"consumer/pkg/worker"
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	workerTask := worker.Start(os.Getenv("BEANSTALK_HOSTNAME"), os.Getenv("BEANSTALK_PORT"))

	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		errors, err := json.Marshal(workerTask.GetErrors())
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(errors)
		if err != nil {
			log.Println(err)
		}
	})

	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(200)
	})

	log.Fatal(http.ListenAndServe(":8080", nil))
}
