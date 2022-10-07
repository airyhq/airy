package co.airy.core.communication.lucene;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.document.IntPoint;
import org.apache.lucene.document.LongPoint;
import org.apache.lucene.queryparser.classic.ParseException;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.Query;

import java.util.Set;

public class ExtendedQueryParser extends QueryParser {
    private final Set<String> intFields;
    private final Set<String> longFields;

    public ExtendedQueryParser(Set<String> intFields,
                               Set<String> longFields,
                               String field,
                               Analyzer analyzer) {
        super(field, analyzer);
        this.intFields = intFields;
        this.longFields = longFields;
    }

    protected Query getFieldQuery(String field, String queryText, boolean quoted) throws ParseException {
        if (intFields.contains(field)) {
            return IntPoint.newExactQuery(field, Integer.parseInt(queryText));
        }
        if (longFields.contains(field)) {
            return LongPoint.newExactQuery(field, Long.parseLong(queryText));
        }

        return super.getFieldQuery(field, queryText, quoted);
    }

    protected Query newRangeQuery(String field, String part1, String part2, boolean startInclusive,
                                  boolean endInclusive) {
        if (intFields.contains(field)) {
            return IntPoint.newRangeQuery(field, Integer.parseInt(part1), getUpperIntBound(part2));
        }
        if (longFields.contains(field)) {
            return LongPoint.newRangeQuery(field, Long.parseLong(part1), getUpperLongBound(part2));
        }

        return super.newRangeQuery(field, part1, part2, startInclusive, endInclusive);
    }

    private int getUpperIntBound(String part2) {
        if (part2 == null) {
            return Integer.MAX_VALUE;
        }

        return Integer.parseInt(part2);
    }

    private long getUpperLongBound(String part2) {
        if (part2 == null) {
            return Long.MAX_VALUE;
        }

        return Integer.parseInt(part2);
    }
}
