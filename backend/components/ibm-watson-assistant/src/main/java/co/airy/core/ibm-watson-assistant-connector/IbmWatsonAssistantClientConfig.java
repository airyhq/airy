package co.airy.core.ibm_watson_assistant_connector;

import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import feign.auth.BasicAuthRequestInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class IbmWatsonAssistantClientConfig {
    @Bean
    public IbmWatsonAssistantClient ibmWatsonAssistantClient(@Value("${ibm-watson-assistant.URL}") String url,
            @Value("${ibm-watson-assistant.assistantId}") String assistantId,
            @Value("${ibm-watson-assistant.apiKey}") String apiKey) {
        return Feign.builder()
                .client(new OkHttpClient())
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .requestInterceptor(new BasicAuthRequestInterceptor("apikey", apiKey))
                .logger(new feign.Logger.ErrorLogger())
                .logLevel(feign.Logger.Level.FULL)
                .target(IbmWatsonAssistantClient.class,
                        String.format("%1$s/v2/assistants/%2$s/message?version=2021-06-14", url, assistantId));
    }
}
