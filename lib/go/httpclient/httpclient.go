package httpclient

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Client struct {
	BaseURL  string
	JWTToken string
	c        *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		c: &http.Client{
			Timeout: time.Minute,
		},
	}
}

func (c *Client) post(endpoint string, payload []byte, res interface{}) error {
	req, err := http.NewRequest("POST", fmt.Sprintf("%s/%s", c.BaseURL, endpoint), bytes.NewBuffer(payload))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Accept", "application/json; charset=utf-8")
	if c.JWTToken != "" {
		req.Header.Set("Authorization", c.JWTToken)
	}

	r, err := c.c.Do(req)
	if err != nil {
		return err
	}

	defer r.Body.Close()

	if r.StatusCode < http.StatusOK || r.StatusCode >= http.StatusBadRequest {
		return fmt.Errorf("request was unsuccessful. Status code: %d", r.StatusCode)
	}

	return json.NewDecoder(r.Body).Decode(&res)
}
