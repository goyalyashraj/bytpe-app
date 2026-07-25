package com.bytepe.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${spring.datasource.username:root}")
    private String username;

    @Value("${spring.datasource.password:}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = rawUrl;
        String dbUser = username;
        String dbPassword = password;

        // Auto-detect Railway environment variables if SPRING_DATASOURCE_URL is empty
        String mysqlHost = System.getenv("MYSQLHOST");
        String mysqlPort = System.getenv("MYSQLPORT");
        String mysqlDb = System.getenv("MYSQLDATABASE");
        String mysqlUser = System.getenv("MYSQLUSER");
        String mysqlPass = System.getenv("MYSQLPASSWORD");
        String mysqlUrl = System.getenv("MYSQL_URL");

        if ((jdbcUrl == null || jdbcUrl.isBlank() || jdbcUrl.contains("localhost")) && mysqlHost != null) {
            jdbcUrl = "jdbc:mysql://" + mysqlHost + ":" + (mysqlPort != null ? mysqlPort : "3306") + "/" + (mysqlDb != null ? mysqlDb : "railway");
            if (mysqlUser != null) dbUser = mysqlUser;
            if (mysqlPass != null) dbPassword = mysqlPass;
        } else if ((jdbcUrl == null || jdbcUrl.isBlank()) && mysqlUrl != null) {
            jdbcUrl = mysqlUrl;
        }

        // Auto-fix Railway URL if it starts with mysql:// instead of jdbc:mysql://
        if (jdbcUrl != null && jdbcUrl.startsWith("mysql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }

        // Default local fallback if URL still null
        if (jdbcUrl == null || jdbcUrl.isBlank()) {
            jdbcUrl = "jdbc:h2:mem:bytepe_db;DB_CLOSE_DELAY=-1;MODE=MySQL";
        }

        // Add standard MySQL flags if not present
        if (jdbcUrl.startsWith("jdbc:mysql://") && !jdbcUrl.contains("createDatabaseIfNotExist")) {
            jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(dbUser);
        config.setPassword(dbPassword);
        if (jdbcUrl.startsWith("jdbc:h2:")) {
            config.setDriverClassName("org.h2.Driver");
        } else {
            config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        }
        config.setMaximumPoolSize(5);
        config.setConnectionTimeout(30000);

        return new HikariDataSource(config);
    }
}
