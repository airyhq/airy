package httpclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

type Client struct {
	BaseURL string
	Token   string
	c       *http.Client
}

func NewClient(baseURL string, authToken string) *Client {
	return &Client{
		BaseURL: baseURL,
		Token:   authToken,
		c: &http.Client{
			Timeout: time.Minute,
		},
	}
}

func post[T any](c *Client, endpoint string, payload []byte) (T, error) {
	req, err := http.NewRequest("POST", fmt.Sprintf("http://%s/%s", c.BaseURL, endpoint), bytes.NewReader(payload))
	if err != nil {
		return *new(T), err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Accept", "application/json; charset=utf-8")
	if c.Token != "" {
		req.Header.Set("Authorization", c.Token)
	}
	fmt.Println(string(payload))
	r, err := c.c.Do(req)
	if err != nil {
		return *new(T), err
	}

	defer r.Body.Close()

	if r.StatusCode < http.StatusOK || r.StatusCode >= http.StatusBadRequest {
		return *new(T), fmt.Errorf("request was unsuccessful. Status code: %d", r.StatusCode)
	}

	blob, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return *new(T), err
	}

	var obj T
	if err := json.Unmarshal(blob, &obj); err != nil {
		return *new(T), err
	}

	return obj, nil
}
