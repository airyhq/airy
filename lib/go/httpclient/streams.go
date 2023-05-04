package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/payloads"
)

func (c *Client) ListStreams() (*payloads.KsqlGetStreamsResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                "LIST STREAMS;",
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlGetStreamsResponsePayload](c, "ksql", payload)
}

func (c *Client) CreateStreams(expr string) (*payloads.KsqlGetStreamsResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                expr,
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlGetStreamsResponsePayload](c, "ksql", payload)
}
