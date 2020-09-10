package backend.lib.uuid.src.main.java.co.airy.uuid;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.UUID;

/**
 * Unfortunately Java does not have a UUID v5 implementation
 * This implementation is taken out from https://github.com/eugenp/tutorials/tree/master/core-java-modules/core-java/
 * Reference: https://www.baeldung.com/java-uuid
 */
public class UUIDV5 {
    public static UUID fromNamespaceAndName(String namespace, String name) {
        try {
            String source = namespace + name;
            byte[] bytes = source.getBytes("UTF-8");
            UUID uuid = type5UUIDFromBytes(bytes);
            return uuid;
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Could not encode bytes");
        }
    }

    public static UUID type5UUIDFromBytes(byte[] name) {
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-1");
        } catch (NoSuchAlgorithmException nsae) {
            throw new InternalError("SHA-1 not supported", nsae);
        }
        byte[] bytes = Arrays.copyOfRange(md.digest(name), 0, 16);
        bytes[6] &= 0x0f; /* clear version        */
        bytes[6] |= 0x50; /* set to version 5     */
        bytes[8] &= 0x3f; /* clear variant        */
        bytes[8] |= 0x80; /* set to IETF variant  */
        return constructType5UUID(bytes);
    }

    private static UUID constructType5UUID(byte[] data) {
        long msb = 0;
        long lsb = 0;
        assert data.length == 16 : "data must be 16 bytes in length";

        for (int i = 0; i < 8; i++)
            msb = (msb << 8) | (data[i] & 0xff);

        for (int i = 8; i < 16; i++)
            lsb = (lsb << 8) | (data[i] & 0xff);
        return new UUID(msb, lsb);
    }
}
