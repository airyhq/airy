package scheduler

import (
	"fmt"
	"github.com/beanstalkd/go-beanstalk"

	"beanstalk-worker/pkg/scheduler/consumer"
	"log"
	"time"
)

type Task struct {
	ticker          *time.Ticker
	beanstalkClient *beanstalk.Conn
	consumer        consumer.Task
}

func Start(hostname, port string) *Task {
	conn, err := beanstalk.Dial("tcp", fmt.Sprintf("%s:%s", hostname, port))

	if err != nil {
		log.Println("Failed to connect to Beanstalk", err)
	}

	t := &Task{
		ticker:          time.NewTicker(time.Minute),
		beanstalkClient: conn,
		consumer:        consumer.StartConsumer(conn),
	}

	log.Println("Webhook scheduler started")
	return t
}

type ConsumerStatus struct {
	Errors []consumer.ConsumerError
	Queue  string
}

func (t *Task) GetStatus() ConsumerStatus {
	status := ConsumerStatus{
		Errors: t.consumer.GetErrors(),
		Queue:  "q",
	}

	return status
}
