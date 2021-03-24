package config

import (
	"context"
	"fmt"
	"os"

	corev1 "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
)

func applyConfigMap(configMapName string, newCmData map[string]string, clientset *kubernetes.Clientset, namespace string) error {
	cm, _ := clientset.CoreV1().ConfigMaps(namespace).Get(context.TODO(), configMapName, v1.GetOptions{})

	if cm.GetName() == "" {
		_, err := clientset.CoreV1().ConfigMaps(namespace).Create(context.TODO(),
			&corev1.ConfigMap{
				ObjectMeta: v1.ObjectMeta{
					Name:      configMapName,
					Namespace: namespace,
				},
				Data: newCmData,
			}, v1.CreateOptions{})
		return err
	} else {
		cm.Data = newCmData
		_, err := clientset.CoreV1().ConfigMaps(namespace).Update(context.TODO(), cm, v1.UpdateOptions{})
		return err
	}

}

func facebookApply(airyConf airyConf, clientset *kubernetes.Clientset) bool {
	facebookConfig := airyConf.Apps.Sources.Facebook
	if facebookConfig.AppID != "" || facebookConfig.AppSecret != "" || facebookConfig.WebhookSecret != "" {
		configMapData := make(map[string]string, 0)
		configMapData["FACEBOOK_APP_ID"] = facebookConfig.AppID
		configMapData["FACEBOOK_APP_SECRET"] = facebookConfig.AppSecret
		configMapData["FACEBOOK_WEBHOOK_SECRET"] = facebookConfig.WebhookSecret
		err := applyConfigMap("sources-facebook", configMapData, clientset, airyConf.Global.Namespace)

		if err != nil {
			fmt.Println("unable to update configMap: ", err)
			os.Exit(1)
		}

		return true
	}

	return false
}

func googleApply(airyConf airyConf, clientset *kubernetes.Clientset) bool {
	googleConfig := airyConf.Apps.Sources.Google
	if googleConfig.PartnerKey != "" || googleConfig.SaFile != "" {
		configMapData := make(map[string]string, 0)
		configMapData["GOOGLE_PARTNER_KEY"] = googleConfig.PartnerKey
		configMapData["GOOGLE_SA_FILE"] = googleConfig.SaFile

		err := applyConfigMap("sources-google", configMapData, clientset, airyConf.Global.Namespace)

		if err != nil {
			fmt.Println("unable to update configMap: ", err)
			os.Exit(1)
		}

		return true
	}

	return false
}

func twilioApply(airyConf airyConf, clientset *kubernetes.Clientset) bool {
	twilioConfig := airyConf.Apps.Sources.Twilio
	if twilioConfig.AccountSid != "" || twilioConfig.AuthToken != "" {
		configMapData := make(map[string]string, 0)
		configMapData["TWILIO_ACCOUNT_SID"] = twilioConfig.AccountSid
		configMapData["TWILIO_AUTH_TOKEN"] = twilioConfig.AuthToken

		err := applyConfigMap("sources-twilio", configMapData, clientset, airyConf.Global.Namespace)

		if err != nil {
			fmt.Println("unable to update configMap: ", err)
			os.Exit(1)
		}

		return true
	}

	return false
}

func webhooksApply(airyConf airyConf, clientset *kubernetes.Clientset,) bool {
	webhooksConfig := airyConf.Apps.Webhooks
	if webhooksConfig.Name != "" {
		configMapData := make(map[string]string, 0)
		configMapData["NAME"] = webhooksConfig.Name

		err := applyConfigMap("webhooks-config", configMapData, clientset, airyConf.Global.Namespace)

		if err != nil {
			fmt.Println("unable to update configMap: ", err)
			os.Exit(1)
		}

		return true
	}

	return false
}
