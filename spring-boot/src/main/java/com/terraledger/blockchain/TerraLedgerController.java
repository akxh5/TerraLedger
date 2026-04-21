package com.terraledger.blockchain;

import com.terraledger.blockchain.TerraLedgerService.LandRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.util.List;
import java.util.UUID;
import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/lands")
public class TerraLedgerController {

    private final TerraLedgerService terraLedgerService;
    private final LandService landService;
    
    @Autowired
    private LandRepository landRepository;

    @Autowired
    private LandRequestRepository landRequestRepository;

    public TerraLedgerController(TerraLedgerService terraLedgerService, LandService landService) {
        this.terraLedgerService = terraLedgerService;
        this.landService = landService;
    }

    @PostMapping("/request")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<?> requestLand(@RequestBody LandRequestEntity request) {
        try {
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
            
            request.setOwnerAddress(currentUser);
            request.setStatus("PENDING");
            request.setCreatedAt(LocalDateTime.now());
            
            landRequestRepository.save(request);
            
            return ResponseEntity.ok(Map.of("status", "success", "message", "Land registration request submitted successfully."));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error submitting land request: " + e.getMessage()));
        }
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<LandRequestEntity>> getMyRequests() {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(landRequestRepository.findByOwnerAddress(currentUser));
    }

    @GetMapping("/my-properties")
    public ResponseEntity<List<LandEntity>> getMyProperties() {
        String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
        List<LandEntity> lands = landRepository.findByOwnerAddress(currentUser);
        return ResponseEntity.ok(lands);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<LandEntity>> getAllLands() {
        return ResponseEntity.ok(landRepository.findAll());
    }

    @GetMapping("/requests")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<List<LandRequestEntity>> getPendingRequests() {
        return ResponseEntity.ok(landRequestRepository.findByStatus("PENDING"));
    }

    @PostMapping("/approve/{id}")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<?> approveRequest(@PathVariable UUID id) throws Exception {
        String txHash = landService.approveAndRegisterOnChain(id);
        
        return ResponseEntity.ok(Map.of(
            "status", "success", 
            "message", "Land approved and registered on blockchain.", 
            "transactionHash", txHash
        ));
    }

    @PostMapping("/reject/{id}")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<?> rejectRequest(@PathVariable UUID id) {
        LandRequestEntity landRequest = landRequestRepository.findById(id).orElse(null);
        if (landRequest == null) {
            return ResponseEntity.status(404).body(Map.of("status", "error", "message", "Request not found"));
        }
        if (!"PENDING".equals(landRequest.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Request is not PENDING"));
        }
        
        landRequest.setStatus("REJECTED");
        landRequestRepository.save(landRequest);
        return ResponseEntity.ok(Map.of("status", "success", "message", "Request rejected."));
    }

    // Task 4: Get by ID using DB
    @GetMapping("/{id}")
    public ResponseEntity<?> getLand(@PathVariable Long id) {
        try {
            return landRepository.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error fetching land record: " + e.getMessage()));
        }
    }

    // Task 4: Search
    @GetMapping("/search")
    public ResponseEntity<?> searchLands(@RequestParam String query) {
        try {
            List<LandEntity> results = landRepository.searchLands(query);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error searching lands: " + e.getMessage()));
        }
    }

    // Task 3: Dashboard Stats
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            long totalLands = landRepository.count();
            List<LandEntity> recentTransactions = landRepository.findFirst5ByOrderByCreatedAtDesc();
            
            Map<String, Object> stats = new HashMap<>();
            stats.put("totalLands", totalLands);
            stats.put("recentTransactions", recentTransactions);
            
            Map<String, Long> counts = new HashMap<>();
            counts.put("approved", totalLands);
            counts.put("pending", landRequestRepository.countByStatus("PENDING"));
            stats.put("counts", counts);

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error fetching stats: " + e.getMessage()));
        }
    }

    @PostMapping("/transfer/initiate")
    public ResponseEntity<?> initiateTransfer(@RequestBody InitiateTransferRequest request) {
        try {
            TransactionReceipt receipt = terraLedgerService.initiateTransfer(
                BigInteger.valueOf(request.getLandId()),
                request.getToAddress()
            ).send();
            return ResponseEntity.ok(Map.of("status", "success", "message", "Transfer initiated successfully.", "transactionHash", receipt.getTransactionHash()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error initiating transfer: " + e.getMessage()));
        }
    }

    @PostMapping("/transfer/approve")
    public ResponseEntity<?> approveTransfer(@RequestBody ApproveTransferRequest request) {
        try {
            TransactionReceipt receipt = terraLedgerService.approveTransfer(
                BigInteger.valueOf(request.getLandId())
            ).send();
            
            // After transfer approval, we should update the DB record too
            // Note: In a real system, we'd listen to blockchain events or use a more robust way to sync
            // For now, let's try to update if we have the land ID
            // landRepository.findById(...)
            
            return ResponseEntity.ok(Map.of("status", "success", "message", "Transfer approved successfully.", "transactionHash", receipt.getTransactionHash()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error approving transfer: " + e.getMessage()));
        }
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getOwnershipHistory(@PathVariable BigInteger id) {
        try {
            List<String> history = terraLedgerService.getOwnershipHistory(id).send();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("status", "error", "message", "Error fetching ownership history: " + e.getMessage()));
        }
    }

    // DTOs for request bodies
    public static class InitiateTransferRequest {
        private long landId;
        private String toAddress;

        // Getters and Setters
        public long getLandId() { return landId; }
        public void setLandId(long landId) { this.landId = landId; }
        public String getToAddress() { return toAddress; }
        public void setToAddress(String toAddress) { this.toAddress = toAddress; }
    }

    public static class ApproveTransferRequest {
        private long landId;

        // Getter and Setter
        public long getLandId() { return landId; }
        public void setLandId(long landId) { this.landId = landId; }
    }
}
