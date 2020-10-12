package co.airy.core.api.auth.config;

import javax.sql.DataSource;

import co.airy.core.api.auth.dao.UserDAO;
import co.airy.log.AiryLoggerFactory;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.core.statement.SqlLogger;
import org.jdbi.v3.core.statement.StatementContext;
import org.jdbi.v3.postgres.PostgresPlugin;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;

@Configuration
public class JdbiConfiguration {
    private static final Logger log = AiryLoggerFactory.getLogger(JdbiConfiguration.class);

    @Value("${db.debug:false}")
    private boolean dbDebug;

    @Bean
    public Jdbi jdbi(DataSource ds) {
        TransactionAwareDataSourceProxy proxy = new TransactionAwareDataSourceProxy(ds);
        Jdbi jdbi = Jdbi.create(proxy);

        jdbi.installPlugin(new SqlObjectPlugin());
        jdbi.installPlugin(new PostgresPlugin());

        if (dbDebug) {
            SqlLogger sqlLogger = new SqlLogger() {
                @Override
                public void logBeforeExecution(StatementContext context) {
                    log.info(context.getStatement().toString());
                }
            };
            jdbi.setSqlLogger(sqlLogger);
        }

        return jdbi;
    }

    @Bean
    public UserDAO userDAO(Jdbi jdbi) {
        return jdbi.onDemand(UserDAO.class);
    }
}
