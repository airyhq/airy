package co.airy.crypto;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class Signature {

    public static final String CONTENT_SIGNATURE_HEADER = "X-Airy-Content-Signature";

    /**
     * Computes a signature of the content send to user webhooks so that they can verify its integrity and authenticity.
     *
     * @param key secret key to use for computing the hmac
     * @param content message body
     * @return hmac (sha256) of the content given the key in lowercase hex representation
     * @throws InvalidKeyException Malformed user secret key
     */
    public static String getSignature(String key, String content) throws InvalidKeyException {
        Mac mac;
        try {
            mac = Mac.getInstance("HmacSHA256");
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(), "HmacSHA256");
        mac.init(secretKeySpec);
        byte[] hmac = mac.doFinal(content.getBytes());
        return byteToHex(hmac);
    }

    public static String byteToHex(byte[] payload) {
        StringBuilder builder = new StringBuilder();
        for (byte b : payload) {
            // TODO This is slow compared to the DataTypeConverter implementation
            builder.append(String.format("%02X", b).toLowerCase());
        }
        return builder.toString();
    }

    public static String getSha1(String content) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-1");
            digest.update(content.getBytes(StandardCharsets.UTF_8));
            return byteToHex(digest.digest());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    public static String getHmac(String key, String content) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA1");
            hmac.init(new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA1"));
            return byteToHex(hmac.doFinal(content.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new RuntimeException(e);
        }
    }
}
