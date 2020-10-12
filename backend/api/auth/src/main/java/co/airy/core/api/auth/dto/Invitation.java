package co.airy.core.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.jdbi.v3.core.mapper.reflect.ColumnName;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {
    private UUID id;

    @ColumnName("created_by")
    private User user;
    private String email;
    private Instant sentAt;
    private Instant acceptedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
