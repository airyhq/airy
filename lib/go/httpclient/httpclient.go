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
	if c.Token != "" {
		req.Header.Set("Authorization", c.Token)
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

//NOTE: for now there is no need to return a specific struct. Because we are only getting
//      and printing the data for now
func (c *Client) get(endpoint string) (interface{}, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf("%s/%s", c.BaseURL, endpoint), nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Accept", "application/json; charset=utf-8")
	if c.Token != "" {
		req.Header.Set("Authorization", c.Token)
	}

	r, err := c.c.Do(req)
	if err != nil {
		return nil, err
	}

	defer r.Body.Close()

	if r.StatusCode < http.StatusOK || r.StatusCode >= http.StatusBadRequest {
		return nil, fmt.Errorf("request was unsuccessful. Status code: %d", r.StatusCode)
	}

	blob, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return nil, err
	}

	var components interface{}
	if err := json.Unmarshal(blob, &components); err != nil {
		return nil, err
	}

	return components, nil
}
