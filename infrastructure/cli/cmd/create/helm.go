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

const airyYamlConfigMap = "airy-yaml-config"
const serviceAccountName = "helm-account"

const defaultAiryConfig = `
global:
  appImageTag: develop
  containerRegistry: ghcr.io/airyhq
  namespace: default
`

type Helm struct {
	name      string
	version   string
	namespace string
	clientset *kubernetes.Clientset
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
		clientset: clientSet,
	}
}

func (h *Helm) Setup() error {
	accountClient := h.clientset.CoreV1().ServiceAccounts(h.namespace)

	account := &corev1.ServiceAccount{
		ObjectMeta: metav1.ObjectMeta{
			Name:      serviceAccountName,
			Namespace: h.namespace,
		},
	}
	_, err := accountClient.Create(context.TODO(), account, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	roleBindingClient := h.clientset.RbacV1().ClusterRoleBindings()

	roleBinding := &rbacv1.ClusterRoleBinding{
		ObjectMeta: metav1.ObjectMeta{
			Name:      "helm-account-binding",
			Namespace: h.namespace,
		},
		Subjects: []rbacv1.Subject{{
			Namespace: h.namespace,
			Kind:      "ServiceAccount",
			Name:      serviceAccountName,
		}},
		RoleRef: rbacv1.RoleRef{
			Kind: "ClusterRole",
			Name: "cluster-admin",
		},
	}

	_, err = roleBindingClient.Create(context.TODO(), roleBinding, metav1.CreateOptions{})
	if err != nil {
		return err
	}

	return nil
}

func (h *Helm) InstallCharts() error {
	return h.runHelm([]string{"install", "--values", "/apps/config/airy.yaml", "core", "/apps/helm-chart/"})
}

func (h *Helm) runHelm(args []string) error {
	if err := h.upsertAiryYaml(); err != nil {
		return err
	}

	h.cleanupJob()
	jobsClient := h.clientset.BatchV1().Jobs(h.namespace)

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
							Name:            "helm-runner",
							Image:           "ghcr.io/airyhq/infrastructure/helm:" + h.version,
							Args:            args,
							ImagePullPolicy: corev1.PullAlways,
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "core-config",
									MountPath: "/apps/config",
								},
							},
						},
					},
					Volumes: []corev1.Volume{
						{
							Name: "core-config",
							VolumeSource: corev1.VolumeSource{
								ConfigMap: &corev1.ConfigMapVolumeSource{
									LocalObjectReference: corev1.LocalObjectReference{
										Name: airyYamlConfigMap,
									},
								},
							},
						},
					},
					RestartPolicy:      "Never",
					ServiceAccountName: serviceAccountName,
				},
			},
		},
	}

	_, err := jobsClient.Create(context.TODO(), job, v1.CreateOptions{})
	if err != nil {
		return err
	}

	watcher, err := jobsClient.Watch(context.TODO(), v1.ListOptions{
		LabelSelector: "helm-runner=true",
	})
	if err != nil {
		return err
	}

	ch := watcher.ResultChan()

	for event := range ch {
		switch event.Type {
		case watch.Error:
			h.cleanupJob()
			return fmt.Errorf("helm run failed with error %v", event.Object)
		case watch.Added:
		case watch.Modified:
			job, _ := event.Object.(*batchv1.Job)
			if job.Status.Succeeded == 1 {
				h.cleanupJob()
				return nil
			} else if job.Status.Failed == 1 {
				h.cleanupJob()
				return fmt.Errorf("helm run failed with error %v", event.Object)
			}
		}
	}

	return nil
}

// Create/update airy yaml config map
func (h *Helm) upsertAiryYaml() error {
	cm, _ := h.clientset.CoreV1().ConfigMaps(h.namespace).Get(context.TODO(), airyYamlConfigMap, v1.GetOptions{})

	cmData := map[string]string{
		"airy.yaml": h.getAiryYaml(),
	}

	if cm.GetName() == "" {
		_, err := h.clientset.CoreV1().ConfigMaps(h.namespace).Create(context.TODO(),
			&corev1.ConfigMap{
				ObjectMeta: v1.ObjectMeta{
					Name:      airyYamlConfigMap,
					Namespace: h.namespace,
				},
				Data: cmData,
			}, v1.CreateOptions{})
		return err
	} else {
		cm.Data = cmData
		_, err := h.clientset.CoreV1().ConfigMaps(h.namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
		return err
	}
}

func (h *Helm) getAiryYaml() string {
	return defaultAiryConfig
}

func (h *Helm) cleanupJob() error {
	jobsClient := h.clientset.BatchV1().Jobs(h.namespace)

	deletionPolicy := v1.DeletePropagationBackground
	return jobsClient.Delete(context.TODO(), h.name, v1.DeleteOptions{
		PropagationPolicy: &deletionPolicy,
	})
}
