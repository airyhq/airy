package console

import (
	"fmt"
	"os"
)

func Exit(msg ...interface{}) {
	fmt.Print("❌ ", fmt.Sprintln(msg...))
	os.Exit(1)
}

