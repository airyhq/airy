package httpclient

import (
	"encoding/json"

	"github.com/airyhq/airy/lib/go/payloads"
)

func (c *Client) ListStreams() (*payloads.KsqlResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                "LIST STREAMS;",
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlResponsePayload](c, "ksql", payload)
}

func (c *Client) CreateStream(expr string) (*payloads.KsqlResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                expr,
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlResponsePayload](c, "ksql", payload)
}

func (c *Client) DeleteStream(expr string) (*payloads.KsqlResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                expr,
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlResponsePayload](c, "ksql", payload)
}

func (c *Client) InfoStream(expr string) (*payloads.KsqlResponsePayload, error) {
	streamingProperties := map[string]string{}
	payload, err := json.Marshal(payloads.KsqlRequestPayload{
		Ksql:                expr,
		StreamingProperties: streamingProperties,
	})

	if err != nil {
		return nil, err
	}

	return post[*payloads.KsqlResponsePayload](c, "ksql", payload)
}
