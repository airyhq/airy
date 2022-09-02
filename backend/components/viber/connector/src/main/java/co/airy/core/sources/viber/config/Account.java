package co.airy.core.sources.viber.config;

import co.airy.core.sources.viber.dto.AccountInfo;
import co.airy.log.AiryLoggerFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.viber.bot.ViberSignatureValidator;
import com.viber.bot.api.ViberBot;
import com.viber.bot.message.Message;
import com.viber.bot.profile.BotProfile;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Configuration
public class Account {
    private final Logger log = AiryLoggerFactory.getLogger(Account.class);

    @Value("${authToken}")
    private String authToken;

    @Value("${welcomeMessage:#{null}}")
    private String welcomeMessage;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    WelcomeMessage welcomeMessage(AccountInfo accountInfo) {
        return Optional.ofNullable(welcomeMessage)
                .map((messageString) -> {
                    try {
                        return objectMapper.readValue(messageString, Message.class);
                    } catch (JsonProcessingException e) {
                        log.error("The specified viber.welcomeMessage is not a valid viber message json. Valid message types: https://developers.viber.com/docs/api/rest-bot-api/#message-types");
                        throw new RuntimeException(e);
                    }
                })
                .map((viberMessage) -> {
                    final WelcomeMessage result = new WelcomeMessage();
                    final Map<String, Object> senderMap = new HashMap<>() {{
                        put("name", accountInfo.getName());
                        if (accountInfo.getIcon() != null) {
                            put("avatar", accountInfo.getIcon());
                        }
                    }};
                    result.put("sender", senderMap);
                    result.putAll(viberMessage.getMapRepresentation());
                    return result;
                }).orElse(null);
    }

    @Bean
    ViberBot viberBot(AccountInfo accountInfo) {
        return new ViberBot(new BotProfile(accountInfo.getName(), accountInfo.getIcon()), authToken);
    }

    @Bean
    ViberSignatureValidator signatureValidator() {
        return new ViberSignatureValidator(authToken);
    }

    public static class WelcomeMessage extends HashMap<String, Object> {
    }

    @Bean
    @Qualifier("viberObjectMapper")
    public ObjectMapper viberObjectMapper() {
        return new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.FAIL_ON_MISSING_EXTERNAL_TYPE_ID_PROPERTY, false)
                .setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
    }
}
