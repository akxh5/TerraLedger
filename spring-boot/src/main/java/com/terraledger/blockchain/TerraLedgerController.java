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
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/lands")
public class TerraLedgerController {

    private final TerraLedgerService terraLedgerService;
    
    @Autowired
    private LandRepository landRepository;

    @Autowired
    private LandRequestRepository landRequestRepository;

    public TerraLedgerController(TerraLedgerService terraLedgerService) {
        this.terraLedgerService = terraLedgerService;
    }

    @PostMapping("/request")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<String> requestLand(@RequestBody LandRequestEntity request) {
        try {
            String currentUser = SecurityContextHolder.getContext().getAuthentication().getName();
            
            request.setOwnerAddress(currentUser);
            request.setStatus("PENDING");
            request.setCreatedAt(LocalDateTime.now());
            
            landRequestRepository.save(request);
            
            return ResponseEntity.ok("Land registration request submitted successfully.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error submitting land request: " + e.getMessage());
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
        List<LandEntity> lands = landRepository.findByWalletAddress(currentUser);
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
    public ResponseEntity<String> approveRequest(@PathVariable UUID id) {
        try {
            LandRequestEntity landRequest = landRequestRepository.findById(id).orElse(null);
            if (landRequest == null) {
                return ResponseEntity.notFound().build();
            }
            if (!"PENDING".equals(landRequest.getStatus())) {
                return ResponseEntity.badRequest().body("Request is not PENDING");
            }
            
            // Execute the smart contract call
            TransactionReceipt receipt = terraLedgerService.registerLand(
                landRequest.getId().toString(),
                landRequest.getOwnerAddress(),
                landRequest.getLocation(),
                BigInteger.valueOf(landRequest.getArea()),
                landRequest.getDocumentHash()
            ).send();
            
            landRequest.setStatus("APPROVED");
            landRequest.setTransactionHash(receipt.getTransactionHash());
            landRequest.setApprovedAt(LocalDateTime.now());
            landRequestRepository.save(landRequest);
            
            return ResponseEntity.ok("Land approved and registered on blockchain. Transaction hash: " + receipt.getTransactionHash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving land: " + e.getMessage());
        }
    }

    @PostMapping("/reject/{id}")
    @PreAuthorize("hasRole('REGISTRAR')")
    public ResponseEntity<String> rejectRequest(@PathVariable UUID id) {
        LandRequestEntity landRequest = landRequestRepository.findById(id).orElse(null);
        if (landRequest == null) {
            return ResponseEntity.notFound().build();
        }
        if (!"PENDING".equals(landRequest.getStatus())) {
            return ResponseEntity.badRequest().body("Request is not PENDING");
        }
        
        landRequest.setStatus("REJECTED");
        landRequestRepository.save(landRequest);
        return ResponseEntity.ok("Request rejected.");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getLand(@PathVariable BigInteger id) {
        try {
            LandRecord record = terraLedgerService.getLand(id).send();
            if (record != null) {
                return ResponseEntity.ok(record);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching land record: " + e.getMessage());
        }
    }

    @PostMapping("/transfer/initiate")
    public ResponseEntity<String> initiateTransfer(@RequestBody InitiateTransferRequest request) {
        try {
            TransactionReceipt receipt = terraLedgerService.initiateTransfer(
                BigInteger.valueOf(request.getLandId()),
                request.getToAddress()
            ).send();
            return ResponseEntity.ok("Transfer initiated successfully. Transaction hash: " + receipt.getTransactionHash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error initiating transfer: " + e.getMessage());
        }
    }

    @PostMapping("/transfer/approve")
    public ResponseEntity<String> approveTransfer(@RequestBody ApproveTransferRequest request) {
        try {
            TransactionReceipt receipt = terraLedgerService.approveTransfer(
                BigInteger.valueOf(request.getLandId())
            ).send();
            return ResponseEntity.ok("Transfer approved successfully. Transaction hash: " + receipt.getTransactionHash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving transfer: " + e.getMessage());
        }
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<?> getOwnershipHistory(@PathVariable BigInteger id) {
        try {
            List<String> history = terraLedgerService.getOwnershipHistory(id).send();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching ownership history: " + e.getMessage());
        }
    }

    // DTOs for request bodies
    public static class RegisterLandRequest {
        private String landId;
        private String ownerName;
        private String location;
        private long area;
        private String documentHash;

        // Getters and Setters
        public String getLandId() { return landId; }
        public void setLandId(String landId) { this.landId = landId; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public long getArea() { return area; }
        public void setArea(long area) { this.area = area; }
        public String getDocumentHash() { return documentHash; }
        public void setDocumentHash(String documentHash) { this.documentHash = documentHash; }
    }

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
