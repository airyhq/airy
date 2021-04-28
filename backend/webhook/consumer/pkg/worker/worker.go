package worker

import (
	"context"
	"encoding/json"
	"errors"
	"sync"

	"github.com/beanstalkd/go-beanstalk"
	"github.com/jpillora/backoff"

	"bytes"
	"fmt"

	"log"
	"net/http"
	"time"
)

type Worker struct {
	endpoint     string
	customHeader map[string]string
	beanstalk    *beanstalk.Conn
	backoff      *backoff.Backoff
	errors       []consumerError
}
type consumerError struct {
	Err error
	T   time.Time
}

type webhookConfig struct {
	Id       string
	Endpoint string
	Headers  map[string]map[string]string
	Status   string
}

func Start(
	ctx context.Context,
	wg *sync.WaitGroup,
	webhookConfigStream chan string,
	hostname, port string,
	maxBackoff time.Duration,
) (*Worker, error) {

	conn, err := beanstalk.Dial("tcp", fmt.Sprintf("%s:%s", hostname, port))

	if err != nil {
		return nil, err
	}

	w := Worker{
		endpoint:     "",
		customHeader: make(map[string]string),
		beanstalk:    conn,
		backoff:      &backoff.Backoff{Max: maxBackoff},
		errors:       make([]consumerError, 0),
	}

	wg.Add(2)
	go w.Run(ctx, wg)
	go w.updateWebhookConfig(ctx, wg, webhookConfigStream)
	return &w, nil
}

func (w *Worker) Run(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			log.Println("terminating worker: context canceled ")
			return
		default:
			id, event, err := w.beanstalk.Reserve(1 * time.Minute)
			if errors.Is(err, beanstalk.ErrTimeout) {
				continue
			}
			if err != nil {
				log.Println(err)
				continue
			}

			for {
				select {
				case <-ctx.Done():
					log.Println("terminating worker: context cancelled")
					return
				default:
					err = w.HandleEvent(event)
					if err != nil {
						w.logError(err)
						time.Sleep(w.backoff.Duration())
						continue
					}
					err = w.beanstalk.Delete(id)
					if err != nil {
						w.logError(err)
					}
					w.backoff.Reset()
					break
				}
			}
		}
	}
}

func (w *Worker) updateWebhookConfig(ctx context.Context, wg *sync.WaitGroup, webhookConfigStream chan string) {
	defer wg.Done()
	log.Println("Started updateWebhookConfig routine")
	select {
	case <-ctx.Done():
		log.Println("terminating updateWebhookConfig: context cancelled")
	case config := <-webhookConfigStream:
		var webhookConfig = webhookConfig{}
		if err := json.Unmarshal([]byte(config), &webhookConfig); err != nil {
			log.Fatal(err)
		}
		w.endpoint = webhookConfig.Endpoint
		w.customHeader = webhookConfig.Headers["map"]
	}
}

func (w *Worker) HandleEvent(data []byte) error {
	req, _ := http.NewRequest("POST", w.endpoint, bytes.NewBuffer(data))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Airy/1.0")

	for k, v := range w.customHeader {
		req.Header.Set(k, v)
	}

	client := &http.Client{
		Timeout: 10 * time.Second,
	}
	endpointResp, err := client.Do(req)

	if err != nil {
		return err
	}

	if endpointResp.StatusCode > 299 {
		return fmt.Errorf("%v returned status code %v", w.endpoint, endpointResp.StatusCode)
	}

	return nil
}

func (t *Worker) logError(err error) {
	log.Println(err)
	t.errors = append(t.errors, consumerError{
		Err: err,
		T:   time.Now(),
	})
}

func (t *Worker) GetErrors() []consumerError {
	return t.errors
}
