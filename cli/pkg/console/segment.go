package console

import (
	"fmt"

	"gopkg.in/segmentio/analytics-go.v3"
)

type AiryAnalytics struct {
	client analytics.Client
	disableTracking bool
}

func NewAiryAnalytics(disableTracking bool) *AiryAnalytics {
	return &AiryAnalytics{client: analytics.New("7OOYJk8lQ2jfmZXKz5jJuvcK50BNDHit"), disableTracking: disableTracking}
}

func (a *AiryAnalytics) Track(message analytics.Message) {
	if !a.disableTracking {
		err := a.client.Enqueue(message)
		if err != nil {
			fmt.Println(err)
		}
	}
}
