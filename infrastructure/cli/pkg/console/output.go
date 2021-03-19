package console

import (
	"bufio"
	"os"
)

type StdMiddleware struct {
	stdout *os.File
	stderr *os.File
	writer *os.File
	quit   chan bool
}

func IndentOutput(f func (string) string) StdMiddleware {
	reader, writer, err := os.Pipe()
	if err != nil {
		panic(err)
	}

	s := StdMiddleware{
		stdout: os.Stdout,
		stderr: os.Stderr,
		writer: writer,
	}

	os.Stdout = writer
	os.Stderr = writer

	quit := make(chan bool)
	go func() {
		sc := bufio.NewScanner(reader)
		for {
			select {
			case <-quit:
				return
			default:
				hasMore := sc.Scan()
				if hasMore == false {
					if err := sc.Err(); err != nil {
						_, err = s.stderr.Write([]byte(err.Error()))
						if err != nil {
							panic(err)
						}
					}
					return
				}

				out := f(sc.Text()) + "\n"
				_, err = s.stdout.Write([]byte(out))
				if err != nil {
					panic(err)
				}
			}
		}
	}()

	s.quit = quit

	return s
}

// Reset the os files
func (s StdMiddleware) Close() {
	os.Stdout = s.stdout
	os.Stderr = s.stderr
	close(s.quit)
	if err := s.writer.Close(); err != nil {
		panic(err)
	}
}
