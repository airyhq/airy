package co.airy.core.api.components.configuration;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import co.airy.core.api.components.configuration.model.ComponentsInstalled;
import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;

@Component
public class InstalledComponentsHandler {

    //NOTE: For now will be fetching the installed components from api-components-installer until
    //      we have the installed kafka topic
    private final ApiComponentsInstallerClient client;

    InstalledComponentsHandler(
            @Value("${installer.components.list.url}") String componentsListUrl) {

        this.client = bootstrapApiComponentsInstallerClient(componentsListUrl);
    }

    public Map<String, Boolean> getInstalledComponents() {
        final ComponentsInstalled installed = client.componentsList();

        return installed
            .getComponents()
            .entrySet()
            .stream()
            .map(Map.Entry::getValue)
            .collect(Collectors.toMap(ComponentsInstalled.Details::getName, ComponentsInstalled.Details::isInstalled));
    }

    private ApiComponentsInstallerClient bootstrapApiComponentsInstallerClient(String componentsListUrl) {
        return Feign.builder()
            .client(new OkHttpClient())
            .encoder(new JacksonEncoder())
            .decoder(new JacksonDecoder())
            .logger(new feign.Logger.ErrorLogger())
            .logLevel(feign.Logger.Level.FULL)
            .target(ApiComponentsInstallerClient.class, componentsListUrl);
    }
}
