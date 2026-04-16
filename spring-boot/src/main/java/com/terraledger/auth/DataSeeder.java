package com.terraledger.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String email = "admin@terraledger.gov";
        if (userRepository.findByEmail(email).isEmpty()) {
            User registrar = new User(email, passwordEncoder.encode("admin123"), Role.REGISTRAR);
            userRepository.save(registrar);
            System.out.println("✅ Default REGISTRAR seeded: " + email);
        } else {
            System.out.println("ℹ️  REGISTRAR exists: " + email);
        }
    }
}
