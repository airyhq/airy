package co.airy.core.webhook.consumer;

import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

@Service
public class Signature {

    /**
     * Computes a signature of the content send to user webhooks so that they can verify its integrity and authenticity.
     *
     * @param key secret key to use for computing the hmac
     * @param content message body
     * @return hmac (sha256) of the content given the key in lowercase hex representation
     * @throws InvalidKeyException Malformed user secret key
     */
    public String getSignature(String key, String content) throws InvalidKeyException {
        Mac mac;
        try {
            mac = Mac.getInstance("HmacSHA256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmac = mac.doFinal(content.getBytes());
        StringBuilder builder = new StringBuilder();
        for (byte b : hmac) {
            builder.append(String.format("%02X", b).toLowerCase());
        }
        return builder.toString();
    }
}
