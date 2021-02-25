package create

import (
	"context"
	"fmt"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	watch "k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"log"
)

type Helm struct {
	name      string
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
		name:      "helm-runner",
		namespace: namespace,
		version:   version,
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

	roleBinding := &rbacv1.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "helm-account-binding",
			Namespace: h.namespace,
		},
		Subjects: []rbacv1.Subject{rbacv1.Subject{
			Namespace: h.namespace,
			Kind:      "ServiceAccount",
			Name:      "helm-account",
		}},
		RoleRef: rbacv1.RoleRef{
			Kind: "ClusterRole",
			Name: "cluster-admin",
		},
	}

	_, err = roleBindingClient.Create(context.TODO(), roleBinding, metav1.CreateOptions{})
	if err != nil {
		log.Fatal(err)
	}
}

func (h *Helm) InstallCharts() {
	jobsClient := h.clientSet.BatchV1().Jobs(h.namespace)

	job := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      h.name,
			Namespace: h.namespace,
			Labels:    map[string]string{"helm-runner": "true"},
		},
		Spec: batchv1.JobSpec{
			Template: corev1.PodTemplateSpec{
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:  "my-job",
							Image: "busybox",
							Args:  []string{"ls"},
						},
					},
					RestartPolicy:      "Never",
					ServiceAccountName: "helm-account",
				},
			},
		},
	}

	_, jobCreationErr := jobsClient.Create(context.TODO(), job, v1.CreateOptions{})
	if jobCreationErr != nil {
		panic(jobCreationErr)
	}

	watcher, watcherErr := jobsClient.Watch(context.TODO(), v1.ListOptions{
		LabelSelector: "helm-runner=true",
	})
	if watcherErr != nil {
		panic(watcherErr)
	}
	ch := watcher.ResultChan()

	for event := range ch {
		watchedJob, _ := event.Object.(*batchv1.Job)
		switch event.Type {
		case watch.Added:
			fmt.Println("Running Helm")
		case watch.Modified:
			success := watchedJob.Status.Succeeded
			if success == 1 {
				fmt.Println("Helm finished running")
				jobDeletionErr := jobsClient.Delete(context.TODO(), h.name, v1.DeleteOptions{})
				if jobDeletionErr == nil {
					fmt.Println("Job deleted")
					return
				}
			}
		}
	}
}
