package co.airy.date.format;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.TemporalAccessor;

public class DateFormat {
    private static final DateTimeFormatter dateTimeFormatter = new DateTimeFormatterBuilder().parseCaseInsensitive().appendInstant(3).toFormatter();
    private static final DateTimeFormatter isoParser = DateTimeFormatter.ISO_DATE_TIME;

    public static String isoFromMillis(Long epochMilli) {
        return dateTimeFormatter.format(Instant.ofEpochMilli(epochMilli));
    }

    public static Instant instantFromIso(String isoDateString) {
        final TemporalAccessor parsed = isoParser.parse(isoDateString);
        return Instant.from(parsed);
    }
}
