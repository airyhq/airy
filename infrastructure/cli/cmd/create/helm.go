package create

import (
	"context"
	"fmt"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"log"
)

type Helm struct {
	version   string
	namespace string
	clientSet *kubernetes.Clientset
}

func New(kubeConfigPath string, version string, namespace string) Helm {
	config, err := clientcmd.BuildConfigFromFlags("", kubeConfigPath)
	if err != nil {
		log.Fatal(err)
	}

	clientSet, clientSetErr := kubernetes.NewForConfig(config)
	if clientSetErr != nil {
		log.Fatal(clientSetErr)
	}

	return Helm{
		namespace: namespace,
		version: version,
		clientSet: clientSet,
	}
}

func (h *Helm) Setup() {
	accountClient := h.clientSet.CoreV1().ServiceAccounts(h.namespace)

	account := &corev1.ServiceAccount{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "helm-account",
			Namespace: h.namespace,
		},
	}
	_, err := accountClient.Create(context.TODO(), account, metav1.CreateOptions{})
	if err != nil {
		log.Fatal(err)
	}

	roleBindingClient := h.clientSet.RbacV1().ClusterRoleBindings()

	roleBinding := &v1.ClusterRoleBinding{

	}

	roleBindingClient.Create(context.TODO(), roleBinding, metav1.CreateOptions{})
}

func (h *Helm) InstallCharts() {
	jobsClient := h.clientSet.BatchV1().Jobs(h.namespace)

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "helm-runner",
			Namespace: h.namespace,
		},
		Spec: batchv1.JobSpec{
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "my-job",
							Image: "",
						},
					},
					RestartPolicy: "Never",
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
