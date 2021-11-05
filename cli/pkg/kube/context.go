package kube

import (
	"errors"

	"github.com/spf13/viper"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth/gcp"
	"k8s.io/client-go/tools/clientcmd"
)

type KubeCtx struct {
	KubeConfigPath string
	ContextName    string
}

func New(kubeConfigPath, contextName string) KubeCtx {
	return KubeCtx{
		KubeConfigPath: kubeConfigPath,
		ContextName:    contextName,
	}
}

func (c *KubeCtx) GetClientSet() (*kubernetes.Clientset, error) {
	if c.ContextName == "" {
		if c.KubeConfigPath == "" {
			return nil, errors.New("kube context is empty")
		}

		config, err := clientcmd.BuildConfigFromFlags("", c.KubeConfigPath)
		if err != nil {
			return nil, err
		}

		return kubernetes.NewForConfig(config)
	}

	file, err := clientcmd.LoadFromFile(c.KubeConfigPath)
	if err != nil {
		return nil, err
	}

	config, err := clientcmd.NewNonInteractiveClientConfig(*file, c.ContextName, nil, nil).ClientConfig()
	if err != nil {
		return nil, err
	}

	return kubernetes.NewForConfig(config)
}

func (c *KubeCtx) Store() error {
	viper.Set("KubeConfig", c.KubeConfigPath)
	viper.Set("ContextName", c.ContextName)
	return viper.WriteConfig()
}

func Load() KubeCtx {
	return New(viper.GetString("KubeConfig"), viper.GetString("ContextName"))
}
