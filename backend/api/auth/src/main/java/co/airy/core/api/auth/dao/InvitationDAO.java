package co.airy.core.api.auth.dao;

import co.airy.core.api.auth.dto.Invitation;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public interface InvitationDAO {
    @SqlUpdate("INSERT INTO invitations(id, email, sent_at, accepted_at, created_at, updated_at) VALUES (:id, :email, :sentAt, :acceptedAt, :createdAt, :updatedAt)")
    @RegisterBeanMapper(Invitation.class)
    void insert(@BindBean Invitation invitation);

    @SqlQuery("SELECT id, email, sent_at, accepted_at, created_at, updated_at FROM invitations")
    @RegisterBeanMapper(Invitation.class)
    List<Invitation> listInvitations();
}
