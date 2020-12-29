package co.airy.core.sources.twilio.services;

import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class Api {
    private final String authToken;
    private final String accountSid;

    public Api(@Value("${twilio.auth-token}") String authToken, @Value("${twilio.account-sid}") String accountSid) {
        this.authToken = authToken;
        this.accountSid = accountSid;
    }

    public void sendMessage(String from, String to, String message) throws ApiException {
        Twilio.init(accountSid, authToken);
        Message.creator(new PhoneNumber(to), new PhoneNumber(from), message).create();
    }
}
