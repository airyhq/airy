package co.airy.core.communication.lucene;

import org.apache.lucene.analysis.Analyzer;
import org.apache.lucene.analysis.core.LowerCaseFilterFactory;
import org.apache.lucene.analysis.core.WhitespaceTokenizerFactory;
import org.apache.lucene.analysis.custom.CustomAnalyzer;

import java.io.IOException;

public class AiryAnalyzer {

    public static Analyzer build() throws IOException {
        return CustomAnalyzer
                .builder()
                .withTokenizer(WhitespaceTokenizerFactory.class)
                .addTokenFilter(LowerCaseFilterFactory.class)
                .build();
    }
}
