package co.airy.core.ibm_watson_assistant_connector;

import feign.Feign;
import feign.jackson.JacksonDecoder;
import feign.jackson.JacksonEncoder;
import feign.okhttp.OkHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class  IBMWatsonAssistantClientConfig {
    @Bean
    public  IBMWatsonAssistantClient  IBMWatsonAssistantClient(@Value("${ibm-watson-assistant.URL}") String IBMWatsonAssistantURL) {
        return Feign.builder()
                .client(new OkHttpClient())
                .encoder(new JacksonEncoder())
                .decoder(new JacksonDecoder())
                .logger(new feign.Logger.ErrorLogger())
                .logLevel(feign.Logger.Level.FULL)
                .target(IBMWatsonAssistantClient.class, IBMWatsonAssistantURL);
    }
}
