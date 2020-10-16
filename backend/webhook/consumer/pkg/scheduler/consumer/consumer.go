package consumer

import (
	"bytes"
	"encoding/json"
	"fmt"
	"redis-worker/pkg/scheduler/queue"

	"log"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
)

type ConsumerError struct {
	Err error
	T   time.Time
}

type Task struct {
	done    chan bool
	queue   string
	waitInS int32
	rdb     *redis.Client
	errors  []ConsumerError
}

type AiryMessage struct {
	Endpoint       string
	Headers        map[string]string
	Body           map[string]interface{}
}

func StartConsumer(rdb *redis.Client, queue string) Task {
	t := &Task{
		queue:   queue,
		waitInS: 2,
		rdb:     rdb,
		done:    make(chan bool),
		errors:  make([]ConsumerError, 0),
	}

	go func() {
		for {
			t.Run()
		}
	}()

	log.Printf("consumer spawned [%s]", queue)
	return *t
}

func (t *Task) GetErrors() []ConsumerError {
	return t.errors
}

const endpointRequestTimeout = 60

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
		Timeout: endpointRequestTimeout * time.Second,
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
	retry := 0
	maxRetries := 10
	processingQueue := t.queue + "_processing"

	q := queue.NewQueue(t.rdb)

	result, err := q.Dequeue(processingQueue)
	if err != nil {
		t.logError(fmt.Errorf("failed to dequeue", err))
		return
	}

	if len(result) > 0 {
		message := result[0]
		if err = t.HandleMessage(message); err != nil {
			t.logError(fmt.Errorf("error when processing message for queue %v\n%w", processingQueue, err))
			time.Sleep(time.Duration(t.waitInS) * time.Second)
			t.waitInS = 2 * t.waitInS
			return

		}
		t.waitInS = 2
		q.DeleteFromQueue(processingQueue, message)
	}
	fmt.Println("nothing in processing")

	message, err := q.DequeueEnqueue(t.queue, processingQueue)

	if err != nil {
		t.logError(fmt.Errorf("failed to receive messages %s", err))
		return
	}

	for retry < maxRetries {
		if err = t.HandleMessage(message); err != nil {
			t.logError(fmt.Errorf("error when processing message for queue %v\n%w", t.queue, err))
			time.Sleep(time.Duration(t.waitInS) * time.Second)
			t.waitInS = 2 * t.waitInS
			retry = retry + 1
			fmt.Println("retry %i", retry)

		} else {
			q.DeleteFromQueue(processingQueue, message)
			t.waitInS = 2
			break
		}
	}
}
