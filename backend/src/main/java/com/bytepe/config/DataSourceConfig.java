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

    @Value("${spring.datasource.url}")
    private String rawUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    @Primary
    public DataSource dataSource() {
        String jdbcUrl = rawUrl;
        
        // Auto-fix Railway URL if it starts with mysql:// instead of jdbc:mysql://
        if (jdbcUrl != null && jdbcUrl.startsWith("mysql://")) {
            jdbcUrl = "jdbc:" + jdbcUrl;
        }

        // Add standard MySQL flags if not present
        if (jdbcUrl != null && jdbcUrl.startsWith("jdbc:mysql://") && !jdbcUrl.contains("createDatabaseIfNotExist")) {
            jdbcUrl += (jdbcUrl.contains("?") ? "&" : "?") + "createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(jdbcUrl);
        config.setUsername(username);
        config.setPassword(password);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");
        config.setMaximumPoolSize(5);

        return new HikariDataSource(config);
    }
}
