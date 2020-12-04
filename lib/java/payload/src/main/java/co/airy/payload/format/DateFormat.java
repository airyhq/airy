package co.airy.payload.format;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;

public class DateFormat {
    private static final DateTimeFormatter ISO_INSTANT_WITH_MILLIS_DF = new DateTimeFormatterBuilder().parseCaseInsensitive().appendInstant(3).toFormatter();

    public static String isoFromMillis(Long epochMilli) {
        return ISO_INSTANT_WITH_MILLIS_DF.format(Instant.ofEpochMilli(epochMilli));
    }
}
