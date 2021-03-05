package k8s_cluster

import (
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
)

type Context struct {
	kubeConfigPath string
	contextName string
}

func New(kubeConfigPath, contextName string) Context {
	return Context{
		kubeConfigPath: kubeConfigPath,
		contextName: contextName,
	}
}

func (c *Context) GetClientSet() (*kubernetes.Clientset, error) {
	if c.contextName == "" {
		config, err := clientcmd.BuildConfigFromFlags("", c.kubeConfigPath)
		if err != nil {
			return nil, err
		}

		return kubernetes.NewForConfig(config)
	}

	file, err := clientcmd.LoadFromFile(c.kubeConfigPath)
	if err != nil {
		return nil, err
	}

	config, err := clientcmd.NewNonInteractiveClientConfig(*file, c.contextName, nil, nil).ClientConfig()
	if err != nil {
		return nil, err
	}

	return kubernetes.NewForConfig(config)
}
