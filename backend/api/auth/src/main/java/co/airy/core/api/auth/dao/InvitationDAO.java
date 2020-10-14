package co.airy.core.api.auth.dao;

import co.airy.core.api.auth.dto.Invitation;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.UUID;

@Component
public interface InvitationDAO {
    @SqlUpdate("INSERT INTO invitations(id, email, sent_at, accepted_at, created_at, updated_at) VALUES (:id, :email, :sentAt, :acceptedAt, :createdAt, :updatedAt)")
    @RegisterBeanMapper(Invitation.class)
    void insert(@BindBean Invitation invitation);

    @SqlQuery("select id, email, sent_at, accepted_at, created_at, updated_at from invitations where id = ?")
    @RegisterBeanMapper(Invitation.class)
    Invitation findInvitation(UUID id);

    @SqlUpdate("update invitations set accepted_at = :acceptedAt, updated_at = :updatedAt where id = :id")
    boolean update(UUID id, Instant acceptedAt, Instant updatedAt);
}
