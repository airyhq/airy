package co.airy.core.api.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {
    private UUID id;
    private User createdBy;
    private String email;
    private Instant sentAt;
    private Instant acceptedAt;
    private Instant createdAt;
    private Instant updatedAt;
}
