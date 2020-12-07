package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetFaces(t *testing.T) {
	c := NewClient()

	ctx := context.Background()

	signupRequestPayload := SignupRequestPayload{FirstName: "Grace", LastName: "Hopper", Password: "the_answer_is_42", Email: "grace4@example.com"}

	res, err := c.Signup(ctx, signupRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}
