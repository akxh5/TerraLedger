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
        // Seed REGISTRAR
        String registrarEmail = "admin@terraledger.gov";
        if (userRepository.findByEmail(registrarEmail).isEmpty()) {
            User registrar = new User(registrarEmail, passwordEncoder.encode("admin123"), Role.REGISTRAR);
            userRepository.save(registrar);
            System.out.println("✅ Default REGISTRAR seeded: " + registrarEmail);
        } else {
            System.out.println("ℹ️  REGISTRAR exists: " + registrarEmail);
        }

        // Seed OWNER
        String ownerEmail = "citizen@test.com";
        if (userRepository.findByEmail(ownerEmail).isEmpty()) {
            User owner = new User(ownerEmail, passwordEncoder.encode("password"), Role.OWNER);
            userRepository.save(owner);
            System.out.println("✅ Default OWNER seeded: " + ownerEmail);
        } else {
            System.out.println("ℹ️  OWNER exists: " + ownerEmail);
        }
    }
}
