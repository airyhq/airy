package co.airy.core.api.auth.dao;

import co.airy.core.api.auth.dto.User;
import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public interface UserDAO {

    @SqlUpdate("INSERT INTO users(id,email,first_name,last_name,password_hash) " +
            "values (:id,:email,:firstName,:lastName,:passwordHash)")
    @RegisterBeanMapper(User.class)
    void insert(@BindBean User user);

    @SqlQuery("SELECT * FROM users WHERE id=:id")
    @RegisterBeanMapper(User.class)
    User findById(UUID id);
}
