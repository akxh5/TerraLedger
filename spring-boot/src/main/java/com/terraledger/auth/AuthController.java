package com.terraledger.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");
        String roleStr = request.getOrDefault("role", "OWNER");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "User already exists"));
        }

        Role role;
        try {
            role = Role.valueOf(roleStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            role = Role.OWNER;
        }

        User user = new User(email, passwordEncoder.encode(password), role);
        userRepository.save(user);

        String token = jwtUtils.generateToken(email, role.name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("email", email);
        response.put("role", role.name());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String password = request.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPassword()))
                .map(user -> {
                    String token = jwtUtils.generateToken(email, user.getRole().name());
                    Map<String, Object> response = new HashMap<>();
                    response.put("token", token);
                    response.put("email", email);
                    response.put("role", user.getRole().name());
                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.status(401).body(Map.of("message", "Invalid credentials")));
    }

    @PostMapping("/wallet-login")
    public ResponseEntity<?> walletLogin(@RequestBody Map<String, String> request) {
        String address = request.get("address");
        String signature = request.get("signature");

        if (address == null || signature == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Address and signature are required"));
        }

        // Find or create user by wallet address
        User user = userRepository.findByWalletAddress(address.toLowerCase())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setWalletAddress(address.toLowerCase());
                    newUser.setRole(Role.OWNER);
                    return userRepository.save(newUser);
                });

        String token = jwtUtils.generateToken(address.toLowerCase(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("walletAddress", address);
        response.put("role", user.getRole().name());
        return ResponseEntity.ok(response);
    }
}
