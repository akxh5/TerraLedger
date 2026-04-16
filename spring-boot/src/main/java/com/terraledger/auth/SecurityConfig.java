package com.terraledger.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(request -> {
                var config = new org.springframework.web.cors.CorsConfiguration();
                config.setAllowCredentials(true);
                config.addAllowedOriginPattern("*");
                config.addAllowedHeader("*");
                config.addAllowedMethod("*");
                return config;
            }))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/health").permitAll()
                // Public read endpoints
                .requestMatchers("GET", "/api/lands/search").permitAll()
                .requestMatchers("GET", "/api/lands/dashboard/stats").permitAll()
                .requestMatchers("GET", "/api/lands/blockchain/events").permitAll()
                .requestMatchers("GET", "/api/lands/audit-logs").permitAll()
                .requestMatchers("GET", "/api/lands/history/**").permitAll()
                .requestMatchers("GET", "/api/lands/{id}").permitAll()
                .requestMatchers("GET", "/api/lands/fractional/**").permitAll()
                // Public utility endpoints
                .requestMatchers("POST", "/api/lands/identity/verify").permitAll()
                .requestMatchers("POST", "/api/lands/upload-document").permitAll()
                // RBAC endpoints
                .requestMatchers("POST", "/api/lands/register").hasRole("OWNER")
                .requestMatchers("GET", "/api/lands/my-properties").hasRole("OWNER")
                .requestMatchers("GET", "/api/lands/all").hasRole("REGISTRAR")
                .requestMatchers("POST", "/api/lands/{id}/approve").hasRole("REGISTRAR")
                // Everything else requires auth
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
