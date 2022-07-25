package cache

import (
	"sync"
	"time"

	helmCli "github.com/mittwald/go-helm-client"
	"k8s.io/klog"
)

type DeployedCharts struct {
	deployedCharts map[string]bool
	cli            helmCli.Client
	mu             sync.RWMutex
	refresh        chan struct{}
}

func MustNewDeployedCharts(Cli helmCli.Client) *DeployedCharts {
	dc := DeployedCharts{cli: Cli, deployedCharts: make(map[string]bool), refresh: make(chan struct{})}
	go dc.refreshScheduler()
	dc.RefreshDeployedCharts()
	return &dc
}

func (s *DeployedCharts) refreshDeployedCharts() {
	deployedReleases, err := s.cli.ListDeployedReleases()
	if err != nil {
		klog.Error(err.Error())
		return
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	for _, r := range deployedReleases {
		s.deployedCharts[r.Name] = true
	}
}

func (s *DeployedCharts) refreshScheduler() {
	for {
		select {
		case <-s.refresh:
		case <-time.After(10 * time.Minute):
		}
		//FIXME: remove log
		klog.Info("Refreshing cache")
		s.refreshDeployedCharts()
	}
}

func (s *DeployedCharts) GetDeployedCharts() map[string]bool {
	s.mu.RLock()
	defer s.mu.RUnlock()

	d := make(map[string]bool, len(s.deployedCharts))
	for k, v := range s.deployedCharts {
		d[k] = v
	}

	return d
}

func (s *DeployedCharts) RefreshDeployedCharts() {
	s.refresh <- struct{}{}
}
