package co.airy.uuid;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

import static co.airy.uuid.UUIDv5Builder.fromBytes;

/**
 * Unfortunately the Java standard library does not provide a UUID v5 implementation
 * This implementation is taken out from https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java/
 * Reference: https://www.baeldung.com/java-uuid
 */
public class UUIDv5 {

    public static UUID fromNamespaceAndName(String namespace, String name) {
        return fromName(namespace + name);
    }

    public static UUID fromName(String name) {
        byte[] data = name.getBytes(StandardCharsets.UTF_8);

        final MessageDigest md = getDigest();
        byte[] bytes = Arrays.copyOfRange(md.digest(data), 0, 16);
        return fromBytes(bytes);
    }

    public static UUID fromFile(InputStream inputStream) throws IOException {
        if (inputStream.markSupported()) {
            inputStream.mark(Integer.MAX_VALUE);
        }

        MessageDigest md = getDigest();
        try (DigestInputStream dis = new DigestInputStream(inputStream, md)) {
            while (dis.read() != -1) ; //empty loop to clear the data
            md = dis.getMessageDigest();
        }

        if (inputStream.markSupported()) {
            inputStream.reset();
        }
        return fromBytes(md.digest());
    }

    private static MessageDigest getDigest() {
        try {
            return MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException nsae) {
            throw new InternalError("SHA-1 not supported", nsae);
        }
    }
}
