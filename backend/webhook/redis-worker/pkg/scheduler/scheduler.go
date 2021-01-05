package scheduler

import (
	"fmt"
	"redis-worker/pkg/scheduler/queue"
	"regexp"

	"log"
	"redis-worker/pkg/scheduler/consumer"
	"time"
)

type Task struct {
	ticker    *time.Ticker
	queue     queue.Queue
	consumers map[string]consumer.Task
}

func Start(hostname, port string) *Task {
	t := &Task{
		ticker:    time.NewTicker(time.Minute),
		queue:     queue.NewQueue(queue.GetClient(hostname, port)),
		consumers: make(map[string]consumer.Task),
	}

	go func() {
		t.updateConsumers(t.queue)
		for range t.ticker.C {
			t.updateConsumers(t.queue)
		}
	}()

	log.Println("queue consumer scheduler started")
	return t
}

type ConsumerStatus struct {
	Errors []consumer.ConsumerError
	Queue  string
}

func (t *Task) GetStatuses() []ConsumerStatus {
	errors := make([]ConsumerStatus, len(t.consumers))

	for k, v := range t.consumers {
		if err := v.GetErrors(); err != nil {
			errors = append(errors, ConsumerStatus{
				Errors: err,
				Queue:  k,
			})
		}
	}

	return errors
}

func (t *Task) updateConsumers(q queue.Queue) {
	queues, err := q.GetAllQueues()

	if err != nil {
		log.Println("failed to fetch queues", err)
	}

	for _, it := range queues {
		fmt.Println(it)
		if _, ok := t.consumers[it]; !ok && !isProcessingQueue(it) {
			t.consumers[it] = consumer.StartConsumer(t.queue.Rdb, it)
		}
	}
}

func isProcessingQueue(queue string) bool {
	matched, err := regexp.MatchString(`.*_processing`, queue)

	if err != nil {
		panic(err)
	}

	return matched
}
