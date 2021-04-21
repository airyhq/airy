package integration

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"testing"

	"goji.io"
)

type MockServer struct {
	l    net.Listener
	Host string
	mux  *goji.Mux
}

func NewMockServer(t *testing.T) *MockServer {
	listener, err := net.Listen("tcp", ":0")
	if err != nil {
		t.Fatal("mock server error: ", err)
	}

	mux := goji.NewMux()

	return &MockServer{
		l:    listener,
		mux:  mux,
		Host: fmt.Sprintf("http://localhost:%d", listener.Addr().(*net.TCPAddr).Port),
	}
}

func (ms *MockServer) Serve() {
	http.Serve(ms.l, ms.mux)
}

func mockEndpoint(endpoint string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		data, err := goldenDir.ReadFile("golden/" + endpoint + ".golden")
		if err != nil {
			fmt.Fprint(w, err)
		}
		_, err = w.Write(data)
		if err != nil {
			log.Println(err)
		}
	}
}
