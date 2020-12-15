package scheduler

import (
	"redis-worker/pkg/scheduler/queue"
	"strings"

	"github.com/alicebob/miniredis/v2"

	"testing"
)

func mockRedis() *miniredis.Miniredis {
	s, err := miniredis.Run()

	if err != nil {
		panic(err)
	}

	return s
}

func TestScheduler(t *testing.T) {
	redisServer := setup()
	defer teardown(redisServer)

	addr := strings.Split(redisServer.Addr(), ":")
	schedulerTask := Start(addr[0], addr[1])

	queues, _ := schedulerTask.queue.GetAllQueues()
	q := queue.NewQueue(schedulerTask.queue.Rdb)

	if len(queues) != 0 {
		t.Error("expected empty queue")
	}

	testMessage := "{\"endpoint\":\"https://airy-platform-status.herokuapp.com/receive-message\",\"headers\":{\"X-Custom-Header\":\"custom-code-for-header\"},\"body\":{\"conversation_id\":\"2477cf76-633f-4343-bb22-49983b735131\",\"id\":\"bc685c4e-211f-4ef5-adf7-636ffe78279d\",\"text\":\"All work and no play makes Jack a dull boy\",\"sender\":{\"id\":\"433e835e-76d3-4351-82e7-1c8363766639\"},\"sent_at\":\"2020-09-21T18:50:23.155Z\",\"source\":\"FACEBOOK\",\"postback\":{}}}"

	q.Enqueue("test_queue", testMessage)
	q.Enqueue("test_queue_processing", testMessage)

	schedulerTask.updateConsumers(q)

	queues, _ = q.GetAllQueues()

	if len(queues) != 2 {
		t.Error("expected there to be two queues")
	}

	if len(schedulerTask.consumers) != 1 {
		t.Error("expected scheduler to spawn one consumer task")
	}
}

func setup() *miniredis.Miniredis {
	return mockRedis()
}

func teardown(redisServer *miniredis.Miniredis) {
	redisServer.Close()
}
