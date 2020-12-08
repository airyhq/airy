package apiclient

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"
)

const (
	BaseURL = "http://api.airy"
)

type Client struct {
	BaseURL    string
	HTTPClient *http.Client
}

func NewClient() *Client {
	return &Client{
		BaseURL: BaseURL,
		HTTPClient: &http.Client{
			Timeout: time.Minute,
		},
	}
}

type errorResponse struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type successResponse struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
}

func (c *Client) sendRequest(req *http.Request, v interface{}) error {
	req.Header.Set("Content-Type", "application/json; charset=utf-8")
	req.Header.Set("Accept", "application/json; charset=utf-8")
	// req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))

	res, err := c.HTTPClient.Do(req)
	if err != nil {
		return err
	}

	defer res.Body.Close()

	if res.StatusCode < http.StatusOK || res.StatusCode >= http.StatusBadRequest {
		var errRes errorResponse
		if err = json.NewDecoder(res.Body).Decode(&errRes); err == nil {
			return errors.New(errRes.Message)
		}

		return fmt.Errorf("unknown error, status code: %d", res.StatusCode)
	}
	// result, err := ioutil.ReadAll(res.Body)
	// fmt.Println(string(result))

	// fullResponse := successResponse{
	// 	Data: v,
	// }
	if err = json.NewDecoder(res.Body).Decode(v); err != nil {
		return err
	}

	return nil
}
