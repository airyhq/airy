package co.airy.core.admin;

import co.airy.core.admin.WebhooksController;
import co.airy.avro.communication.User;
import co.airy.avro.ops.HttpLog;
import co.airy.core.admin.util.Topics;
import co.airy.core.config.ServiceDiscovery;
import co.airy.kafka.test.KafkaTestHelper;
import co.airy.kafka.test.junit.SharedKafkaTestResource;
import co.airy.spring.core.AirySpringBootApplication;
import co.airy.spring.test.WebTestHelper;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.extension.RegisterExtension;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static co.airy.test.Timing.retryOnException;
import static java.util.stream.Collectors.toList;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = AirySpringBootApplication.class)
@TestPropertySource(value = "classpath:test.properties")
@AutoConfigureMockMvc
@ExtendWith(SpringExtension.class)
public class UsersControllerTest {

    @RegisterExtension
    public static final SharedKafkaTestResource sharedKafkaTestResource = new SharedKafkaTestResource();
    private static KafkaTestHelper kafkaTestHelper;

    @Autowired
    private WebTestHelper webTestHelper;

    @Autowired
    @InjectMocks
    private WebhooksController webhooksController;

    @MockBean
    private ServiceDiscovery serviceDiscovery;

    private static final List<User> users = List.of(
            User.newBuilder()
                    .setId("user-id-1")
                    .setName("user-name-1")
                    .setFirstSeenAt(Instant.now().toEpochMilli())
                    .setLastSeenAt(Instant.now().toEpochMilli())
                    .build(),
            User.newBuilder()
                    .setId("user-id-2")
                    .setName("user-name-2")
                    .setFirstSeenAt(Instant.now().toEpochMilli())
                    .setLastSeenAt(Instant.now().toEpochMilli())
                    .build()
    );

    @BeforeAll
    static void beforeAll() throws Exception {
        kafkaTestHelper = new KafkaTestHelper(sharedKafkaTestResource, Topics.getTopics());
        kafkaTestHelper.beforeAll();
        kafkaTestHelper.produceRecords(users.stream().map((user) ->
                new ProducerRecord<>(Topics.opsApplicationLogs.name(), UUID.randomUUID().toString(),
                        HttpLog.newBuilder()
                                .setUri("/example")
                                .setUserId(user.getId())
                                .setUserName(user.getName())
                                .setHeaders(Map.of())
                                .build()
                )).collect(toList()));
    }

    @BeforeEach
    void beforeEach() throws Exception {
        MockitoAnnotations.openMocks(this);
        webTestHelper.waitUntilHealthy();
    }

    @AfterAll
    static void afterAll() throws Exception {
        kafkaTestHelper.afterAll();
    }

    @Test
    public void canListUsers() throws Exception {
        retryOnException(() -> webTestHelper.post("/users.list")
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.data", hasSize(2)))
                        .andExpect(jsonPath("$.data[*].id").value(containsInAnyOrder(users.stream()
                                .map(User::getId).toArray()))),
                "list did not return users", 10_000
        );
    }

}
