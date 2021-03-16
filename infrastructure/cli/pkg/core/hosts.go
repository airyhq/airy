package core

import "github.com/spf13/viper"

type AvailableHosts struct {
	Api     Host
	Ui      Host
	Webhook Host
}

type Host struct {
	Url         string
	Description string
}

func LoadHostsFromConfig() AvailableHosts {
	hosts := AvailableHosts{}
	if apiHost := viper.GetString("apihost"); apiHost != "" {
		hosts.Api = Host{Url: apiHost}
	}
	if uiHost := viper.GetString("uihost"); uiHost != "" {
		hosts.Ui = Host{Url: uiHost}
	}
	if webhookHost := viper.GetString("webhookhost"); webhookHost != "" {
		hosts.Webhook = Host{Url: webhookHost}
	}
	return hosts
}

func (a AvailableHosts) Store() error {
	a.ForEach(func(resource string, url string, description string) {
		viper.Set(resource+"host", url)
	})
	return viper.WriteConfig()
}

func (a AvailableHosts) ForEach(f func(resource string, url string, description string)) {
	if a.Api.Url != "" {
		f("api", a.Api.Url, a.Api.Description)
	}
	if a.Ui.Url != "" {
		f("ui", a.Ui.Url, a.Ui.Description)
	}
	if a.Webhook.Url != "" {
		f("webhook", a.Webhook.Url, a.Webhook.Description)
	}
}
