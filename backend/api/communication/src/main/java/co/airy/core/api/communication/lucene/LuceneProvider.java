package co.airy.core.api.communication.lucene;

import co.airy.core.api.communication.dto.ConversationIndex;
import co.airy.core.api.communication.dto.LuceneQueryResult;
import co.airy.log.AiryLoggerFactory;
import org.apache.kafka.streams.KeyValue;
import org.apache.lucene.analysis.core.WhitespaceAnalyzer;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import static java.util.stream.Collectors.toList;

@Component
public class LuceneProvider implements LuceneStore {
    private static final Logger log = AiryLoggerFactory.getLogger(LuceneDiskStore.class);

    final IndexWriter writer;
    final DocumentMapper documentMapper;
    DirectoryReader reader;

    public LuceneProvider() throws IOException {
        boolean testMode = System.getenv("TEST_TARGET") != null;
        FSDirectory dir = FSDirectory.open(Paths.get(testMode ? System.getenv("TEST_TMPDIR") : "/tmp/lucene"));
        IndexWriterConfig config = new IndexWriterConfig(new WhitespaceAnalyzer());
        writer = new IndexWriter(dir, config);
        reader = DirectoryReader.open(writer, true, true);
        documentMapper = new DocumentMapper();
    }

    @Override
    public void put(ConversationIndex conversation) throws IOException {
        final Document document = this.documentMapper.fromConversationIndex(conversation);
        writer.updateDocument(new Term("id", conversation.getId()), document);
    }

    @Override
    public void delete(String id) throws IOException {
        writer.deleteDocuments(new Term("id", id));
    }

    @Override
    public LuceneQueryResult query(Query query) {
        try {
            refreshReader();
            final IndexSearcher indexSearcher = new IndexSearcher(reader);
            final TopDocs topDocs = indexSearcher.search(query, Integer.MAX_VALUE);

            List<ConversationIndex> conversations = new ArrayList<>(topDocs.scoreDocs.length);
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                final Document doc = indexSearcher.doc(scoreDoc.doc);
                conversations.add(documentMapper.fromDocument(doc));
            }

            return LuceneQueryResult.builder()
                    .conversations(conversations)
                    .total(reader.maxDoc()).build();
        } catch (Exception e) {
            log.error("Failed to query Lucene store with query {}", query, e);
            return LuceneQueryResult.builder().conversations(List.of())
                    .total(reader.maxDoc()).build();
        }
    }

    public IndexWriter getWriter() {
        return this.writer;
    }

    private void refreshReader() throws IOException {
        final DirectoryReader newReader = DirectoryReader.openIfChanged(reader, writer);
        if (newReader != null && newReader != reader) {
            reader.close();
            reader = newReader;
        }
    }
}
