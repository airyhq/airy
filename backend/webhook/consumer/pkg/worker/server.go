package worker

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
)

func (worker *Worker) StartServer(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	http.HandleFunc("/status", func(w http.ResponseWriter, r *http.Request) {
		errors, err := json.Marshal(worker.GetErrors())
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

	http.HandleFunc("/actuator/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("{\"status\":\"UP\"}"))
	})

	go func() {
		log.Println("serving on 8080")
		err := http.ListenAndServe(":8080", nil)
		if err != nil {
			panic("ListenAndServe: " + err.Error())
		}
	}()
	<-ctx.Done()
	log.Println("terminating server: context cancelled")
}
