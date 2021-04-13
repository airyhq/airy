package consumer

import (
	"github.com/beanstalkd/go-beanstalk"

	"bytes"
	"encoding/json"
	"fmt"

	"log"
	"net/http"
	"time"
)

type ConsumerError struct {
	Err error
	T   time.Time
}

type Task struct {
	done      chan bool
	beanstalk *beanstalk.Conn
	errors    []ConsumerError
}

type AiryMessage struct {
	Endpoint string
	Headers  map[string]string
	Body     map[string]interface{}
}

func StartConsumer(beanstalk *beanstalk.Conn) Task {
	t := &Task{
		beanstalk: beanstalk,
		done:      make(chan bool),
		errors:    make([]ConsumerError, 0),
	}

	go func() {
		for {
			t.Run()
		}
	}()

	log.Printf("Consumer scheduled")
	return *t
}

func (t *Task) GetErrors() []ConsumerError {
	return t.errors
}

var backoffSchedule = []time.Duration{
	0 * time.Second,
	1 * time.Second,
	3 * time.Second,
	10 * time.Second,
}

func (t *Task) HandleMessage(message string) error {
	data := &AiryMessage{}

	if err := json.Unmarshal([]byte(message), &data); err != nil {
		return err
	}

	jsonString, err := json.Marshal(data.Body)

	if err != nil {
		return err
	}

	req, _ := http.NewRequest("POST", data.Endpoint, bytes.NewBuffer(jsonString))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Airy/1.0")

	for k, v := range data.Headers {
		req.Header.Set(k, v)
	}

	client := &http.Client{
		Timeout: 5 * time.Second,
	}
	endpointResp, err := client.Do(req)

	if err != nil {
		return err
	}

	if endpointResp.StatusCode > 299 {
		return fmt.Errorf("%v returned status code %v", data.Endpoint, endpointResp.StatusCode)
	}

	return nil
}

func (t *Task) logError(err error) {
	log.Println(err)
	t.errors = append(t.errors, ConsumerError{
		Err: err,
		T:   time.Now(),
	})
}

func (t *Task) Run() {
	id, body, err := t.beanstalk.Reserve(1 * time.Minute)

	if err != nil {
		log.Println(err)
		return
	}

	for _, backoff := range backoffSchedule {
		time.Sleep(backoff)
		err = t.HandleMessage(string(body))
		if err != nil {
			t.logError(err)
		} else {
			break
		}
	}
	t.beanstalk.Delete(id)
}
