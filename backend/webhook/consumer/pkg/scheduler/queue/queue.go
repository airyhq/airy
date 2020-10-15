package queue

import (
	"context"
	"fmt"
	"time"

	"github.com/go-redis/redis/v8"
)

type Queue struct {
	ctx context.Context
	Rdb *redis.Client
}

func NewQueue(Rdb *redis.Client) Queue {
	q := &Queue{
		ctx: context.Background(),
		Rdb: Rdb,
	}
	return *q
}

func GetClient(hostname, port string) *redis.Client {
	return redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", hostname, port),
		Password: "", // no password set
		DB:       0,  // use default DB
	})
}

func (q *Queue) GetAllQueues() ([]string, error) {
	var cursor uint64
	var keys []string
	for {
		var err error
		keys, cursor, err = q.Rdb.Scan(q.ctx, cursor, "*", 10).Result()
		if err != nil {
			return nil, err
		}
		if cursor == 0 {
			break
		}
	}

	return keys, nil
}

func (q *Queue) DequeueEnqueue(queue, processingQueue string) (string, error) {
	return q.Rdb.BRPopLPush(q.ctx, queue, processingQueue, 130*time.Second).Result()
}

func (q *Queue) Dequeue(queue string) ([]string, error) {
	return q.Rdb.LRange(q.ctx, queue, 0, 0).Result()
}

func (q *Queue) DeleteFromQueue(queue, message string) {
	q.Rdb.LRem(q.ctx, queue, 1, message)
}

func (q *Queue) Enqueue(queue, message string) *redis.IntCmd {
	return q.Rdb.RPush(q.ctx, queue, message)
}
