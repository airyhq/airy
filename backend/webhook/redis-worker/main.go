package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"redis-worker/pkg/scheduler"
)

func main() {
	schedulerTask := scheduler.Start(os.Getenv("REDIS_HOSTNAME"), os.Getenv("REDIS_PORT"))

	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		errors, err := json.Marshal(schedulerTask.GetStatuses())
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
