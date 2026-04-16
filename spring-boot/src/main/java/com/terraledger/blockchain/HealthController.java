package com.terraledger.blockchain;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.web3j.protocol.Web3j;

import javax.sql.DataSource;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private Web3j web3j;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "UP");

        try (Connection conn = dataSource.getConnection()) {
            result.put("database", conn.isValid(2) ? "CONNECTED" : "ERROR");
        } catch (Exception e) {
            result.put("database", "ERROR: " + e.getMessage());
        }

        try {
            var version = web3j.web3ClientVersion().send();
            result.put("blockchain", version.getWeb3ClientVersion());
        } catch (Exception e) {
            result.put("blockchain", "DISCONNECTED");
        }

        return ResponseEntity.ok(result);
    }
}
