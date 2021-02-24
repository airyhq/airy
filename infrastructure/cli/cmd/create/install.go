package create

import (
	"context"
	"fmt"
	"github.com/mitchellh/go-homedir"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"os"
	"path"
)

func InstallCharts() {
	home, err := homedir.Dir()
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	kubeConfigFile := path.Join(home, ".airy/kube.conf")
	config, kubeConfigErr := clientcmd.BuildConfigFromFlags("", kubeConfigFile)
	if kubeConfigErr != nil {
		panic(kubeConfigErr)
	}
	clientset, clientsetErr := kubernetes.NewForConfig(config)
	if clientsetErr != nil {
		panic(clientsetErr)
	}

	jobsClient := clientset.BatchV1().Jobs("default")

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "bla",
			Namespace: "bla",
		},
		Spec: batchv1.JobSpec{
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "my-job",
							Image: "busybox",
						},
					},
				},
			},
		},
	}

	jobCreation, jobCreationErr := jobsClient.Create(context.TODO(), job, v1.CreateOptions{})
	if jobCreationErr != nil {
		panic(jobCreationErr)
	}

	fmt.Println(jobCreation)

}
