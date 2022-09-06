package co.airy.core.api.components.installer.config;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;

import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

import java.io.FileReader;
import java.io.IOException;

@Configurable
public class K8sClientConfig {

    @Bean
    public ApiClient apiClient(@Value("${kubernetes.config}") String kubeConfigPath) throws IOException, ApiException {
        ApiClient client = ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();

        Configuration.setDefaultApiClient(client);

        return client;
    }
}
