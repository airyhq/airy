package console

import (
	"fmt"
)

type StdWriter struct {
	f func(string) string
}

func GetMiddleware(f func(string) string) StdWriter {
	return StdWriter{
		f: f,
	}
}

func (s StdWriter) Write(p []byte) (int, error) {
	_, err := fmt.Print(s.f(string(p)))
	if err != nil {
		Exit(err)
	}
	return len(p), err
}
