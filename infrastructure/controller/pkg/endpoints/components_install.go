package endpoints

import (
	helmCli "github.com/mittwald/go-helm-client"
)

type ComponentsInstall struct {
	cli *helmCli.Client
}
