package apiclienttest

import (
	"context"
	"lib/go/apiclient"
	"lib/go/apiclient/payloads"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestSignup(t *testing.T) {
	c := apiclient.NewClient()

	ctx := context.Background()

	signupRequestPayload := payloads.SignupRequestPayload{FirstName: "Grace", LastName: "Hopper", Password: "the_answer_is_42", Email: "grace4@example.com"}

	res, err := c.Signup(ctx, signupRequestPayload)

	assert.Nil(t, err, "expecting nil error")
	assert.NotNil(t, res, "expecting non-nil result")

	assert.NotEmpty(t, res.Token, "expecting non-empty token")

}
