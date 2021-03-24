package minikube

import (
	"fmt"
	"github.com/txn2/txeh"
	"io/ioutil"
	"os"
	"os/exec"
	"runtime"
)

func AddHostRecord() error {
	minikubeIp, err := runGetOutput("ip")
	if err != nil {
		return err
	}

	if runtime.GOOS == "windows" {
		fmt.Println("Automatically adding configuring the local host alias is not yet supported on Windows.")
		fmt.Println("Please add the following line to c:\\windows\\system32\\drivers\\etc\\hosts")
		fmt.Printf("%s \t %s", minikubeIp, hostAlias)
		return nil
	}

	hosts, err := txeh.NewHostsDefault()
	if err != nil {
		return err
	}

	hosts.AddHost(minikubeIp, hostAlias)
	fmt.Printf("🚨 Adding an entry to your hosts file so that you can access Airy Core at http://%s", hostAlias)
	fmt.Println()
	fmt.Println("You will be asked for your password")

	content := hosts.RenderHostsFile()
	// The built-in .Save() command from github.com/txn2/txeh crashes if we lack permission
	// Therefore we write the rendered hostfile to a tmp file and overwrite the
	// existing host file with a sudo command that has access to the process stdin
	err = ioutil.WriteFile("/tmp/airy-core.host", []byte(content), 0644)
	if err != nil {
		return err
	}

	cmd := exec.Command("sudo", "bash", "-c", "cat /tmp/airy-core.host > "+hosts.WriteFilePath)
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout

	return cmd.Run()
}
