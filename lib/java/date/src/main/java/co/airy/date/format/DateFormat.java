package co.airy.date.format;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;

public class DateFormat {
    private static final DateTimeFormatter dateTimeFormatter = new DateTimeFormatterBuilder().parseCaseInsensitive().appendInstant(3).toFormatter();

    public static String isoFromMillis(Long epochMilli) {
        return dateTimeFormatter.format(Instant.ofEpochMilli(epochMilli));
    }
}
