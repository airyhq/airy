package helm

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"

	"github.com/airyhq/airy/infrastructure/lib/go/k8s/util"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/watch"
	"k8s.io/client-go/kubernetes"
)

const airyConfigMap = "airy-config-map"
const serviceAccountName = "helm-account"

type Helm struct {
	name       string
	version    string
	namespace  string
	clientset  *kubernetes.Clientset
	configPath string
}

func New(clientset *kubernetes.Clientset, version string, namespace string, configPath string) Helm {
	return Helm{
		name:       "helm-runner",
		namespace:  namespace,
		version:    version,
		clientset:  clientset,
		configPath: configPath,
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
	chartURL := "https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-" + h.version + ".tgz"
	return h.runHelm(append([]string{"install",
		"--values", "/apps/config/airy-config-map.yaml",
		"--namespace", h.namespace,
		"--timeout", "10m0s",
		"airy", chartURL}))
}

func (h *Helm) UpgradeCharts() error {
	chartURL := "https://airy-core-helm-charts.s3.amazonaws.com/stable/airy-" + h.version + ".tgz"
	return h.runHelm(append([]string{"upgrade",
		"--values", "/apps/config/airy-config-map.yaml",
		"--namespace", h.namespace,
		"--timeout", "10m0s",
		"airy", chartURL}))
}

func (h *Helm) runHelm(args []string) error {
	if err := h.UpsertAiryConfigMap(); err != nil {
		return err
	}

	h.cleanupJob()
	jobsClient := h.clientset.BatchV1().Jobs(h.namespace)
	podsClient := h.clientset.CoreV1().Pods(h.namespace)

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
							Image:           "alpine/helm:3.6.3",
							Args:            args,
							ImagePullPolicy: corev1.PullIfNotPresent,
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
										Name: airyConfigMap,
									},
								},
							},
						},
					},
					RestartPolicy:      "Never",
					ServiceAccountName: serviceAccountName,
				},
			},
			BackoffLimit: util.Int32Ptr(0),
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
			return fmt.Errorf("helm run failed with error %v", event.Object)
		case watch.Modified:
			job, _ := event.Object.(*batchv1.Job)
			if job.Status.Succeeded == 1 {
				return nil
			} else if job.Status.Failed == 1 {
				opts := v1.ListOptions{
					LabelSelector: "job-name=helm-runner",
				}
				pods, err := podsClient.List(context.TODO(), opts)
				if err != nil {
					fmt.Println(err)
				}

				for _, pod := range pods.Items {
					fmt.Println("Logs of helm-runner pod:")
					fmt.Println(getPodLogs(pod, h.clientset))
				}

				for _, c := range job.Status.Conditions {
					return fmt.Errorf("Helm job failed: %s", c.Reason)
				}
				return fmt.Errorf("helm run failed with error %v", event.Object)
			}
		default:
		}
	}

	return nil
}

// Create/update airy config map
func (h *Helm) UpsertAiryConfigMap() error {
	cm, _ := h.clientset.CoreV1().ConfigMaps(h.namespace).Get(context.TODO(), airyConfigMap, v1.GetOptions{})

	file, err := ioutil.ReadFile(h.configPath)
	if err != nil {
		return err
	}

	cmData := map[string]string{
		"airy-config-map.yaml": string(file),
	}

	if cm.GetName() != "" {
		cm.Data = cmData
		_, err := h.clientset.CoreV1().ConfigMaps(h.namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
		return err
	}

	_, err = h.clientset.CoreV1().ConfigMaps(h.namespace).Create(context.TODO(),
		&corev1.ConfigMap{
			ObjectMeta: v1.ObjectMeta{
				Name:      airyConfigMap,
				Namespace: h.namespace,
			},
			Data: cmData,
		}, v1.CreateOptions{})
	return err
}

func (h *Helm) cleanupJob() error {
	jobsClient := h.clientset.BatchV1().Jobs(h.namespace)

	deletionPolicy := v1.DeletePropagationBackground
	return jobsClient.Delete(context.TODO(), h.name, v1.DeleteOptions{
		PropagationPolicy: &deletionPolicy,
	})
}

func getPodLogs(pod corev1.Pod, clientset *kubernetes.Clientset) string {
	podLogOpts := corev1.PodLogOptions{}
	req := clientset.CoreV1().Pods(pod.Namespace).GetLogs(pod.Name, &podLogOpts)
	podLogs, err := req.Stream(context.TODO())
	if err != nil {
		return "error in opening stream"
	}
	defer podLogs.Close()

	buf := new(bytes.Buffer)
	_, err = io.Copy(buf, podLogs)
	if err != nil {
		return "error in copy information from podLogs to buf"
	}
	return buf.String()
}
