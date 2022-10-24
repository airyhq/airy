package co.airy.core.api.components.configuration;

import co.airy.core.api.components.configuration.model.ComponentsInstalled;
import feign.Headers;
import feign.RequestLine;

public interface ApiComponentsInstallerClient {

    @RequestLine("POST")
    @Headers("Content-Type: application/json")
    ComponentsInstalled componentsList();
}
