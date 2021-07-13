package co.airy.uuid;

import java.util.UUID;

class UUIDv5Builder {

    /**
     * @param data byte input of length 16
     * @return UUID version 5
     */
    public static UUID fromBytes(byte[] data) {
        assert data.length == 16 : "data must be 16 bytes in length";
        data[6] &= 0x0f; /* clear version        */
        data[6] |= 0x50; /* set to version 5     */
        data[8] &= 0x3f; /* clear variant        */
        data[8] |= 0x80; /* set to IETF variant  */
        return construct(data);
    }

    private static UUID construct(byte[] data) {
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
