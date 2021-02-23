package create

import (
	"fmt"
	"helm.sh/helm/v3/pkg/action"
)

func InstallCharts() {
	inst := &action.Install{
		cfg: &Configuration{},
	}

	fmt.Println(inst)

}
