package co.airy.core.communication.lucene;

import co.airy.core.communication.dto.ConversationIndex;
import co.airy.core.communication.dto.LuceneQueryResult;
import co.airy.log.AiryLoggerFactory;
import org.apache.lucene.document.Document;
import org.apache.lucene.index.DirectoryReader;
import org.apache.lucene.index.IndexWriter;
import org.apache.lucene.index.IndexWriterConfig;
import org.apache.lucene.index.Term;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.Sort;
import org.apache.lucene.search.SortField;
import org.apache.lucene.search.SortedNumericSortField;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.TopFieldCollector;
import org.apache.lucene.store.FSDirectory;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Component
public class LuceneProvider implements LuceneStore {
    private static final Logger log = AiryLoggerFactory.getLogger(LuceneDiskStore.class);

    final IndexWriter writer;
    final DocumentMapper documentMapper;
    DirectoryReader reader;

    public LuceneProvider() throws IOException {
        boolean testMode = System.getenv("TEST_TARGET") != null;
        FSDirectory dir = FSDirectory.open(Paths.get(testMode ? System.getenv("TEST_TMPDIR") : "/tmp/lucene"));
        IndexWriterConfig config = new IndexWriterConfig(AiryAnalyzer.build());

        writer = new IndexWriter(dir, config);
        reader = DirectoryReader.open(writer, true, true);
        documentMapper = new DocumentMapper();
    }

    @Override
    public void put(ConversationIndex conversation) throws IOException {
        if (conversation != null) {
            final Document document = this.documentMapper.fromConversationIndex(conversation);
            writer.updateDocument(new Term("id", conversation.getId()), document);
        }        
    }

    @Override
    public void delete(String id) throws IOException {
        writer.deleteDocuments(new Term("id", id));
    }

    @Override
    public LuceneQueryResult query(Query query, int cursor, int pageSize) {
        try {
            refreshReader();
            final IndexSearcher searcher = new IndexSearcher(reader);
            SortField lastMessageSort = new SortedNumericSortField("last_message_at", SortField.Type.LONG, true);
            Sort sort = new Sort(lastMessageSort);
            final TopFieldCollector collector = TopFieldCollector.create(sort, 2000, Integer.MAX_VALUE);

            searcher.search(query, collector);
            final TopDocs hits = collector.topDocs(cursor, pageSize);

            List<ConversationIndex> conversations = new ArrayList<>(hits.scoreDocs.length);
            for (ScoreDoc scoreDoc : hits.scoreDocs) {
                final Document doc = searcher.doc(scoreDoc.doc);
                conversations.add(documentMapper.fromDocument(doc));
            }

            return LuceneQueryResult.builder()
                    .conversations(conversations)
                    .filteredTotal(hits.totalHits.value)
                    .total(reader.numDocs()).build();
        } catch (Exception e) {
            log.error("Failed to query Lucene store with query {}", query, e);
            return LuceneQueryResult.builder().conversations(List.of())
                    .total(reader.numDocs()).filteredTotal(0).build();
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
