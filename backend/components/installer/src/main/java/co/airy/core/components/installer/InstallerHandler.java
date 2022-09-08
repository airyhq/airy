package co.airy.core.api.components.installer;

import io.kubernetes.client.openapi.ApiClient;
import org.springframework.stereotype.Service;

@Service
public class InstallerHandler {

    private final ApiClient apiClient;

    InstallerHandler(ApiClient apiClient) {
        this.apiClient = apiClient;
    }
}
