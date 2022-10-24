package co.airy.core.api.components.configuration.config;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileReader;
import java.io.IOException;

@Configuration
public class K8sClientConfig {

    @Bean
    public ApiClient apiClient(@Value("${kubernetes.config}") String kubeConfigPath) throws IOException, ApiException {
        ApiClient client;
        if (kubeConfigPath.length() == 0) {
            client = withInCluster();
        } else {
            client = fromConfig(kubeConfigPath);
        }

        io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);

        return client;
    }

    private ApiClient fromConfig(String kubeConfigPath) throws IOException, ApiException {
        final ApiClient client = ClientBuilder.kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath))).build();


        return client;
    }

    private ApiClient withInCluster() throws IOException, ApiException {
        final ApiClient client = ClientBuilder.cluster().build();

        return client;
    }

}
