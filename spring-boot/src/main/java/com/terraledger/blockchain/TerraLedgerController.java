package com.terraledger.blockchain;

import com.terraledger.blockchain.TerraLedgerService.LandRecord;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/land")
public class TerraLedgerController {

    private final TerraLedgerService terraLedgerService;

    public TerraLedgerController(TerraLedgerService terraLedgerService) {
        this.terraLedgerService = terraLedgerService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerLand(@RequestBody RegisterLandRequest request) {
        try {
            TransactionReceipt receipt = terraLedgerService.registerLand(
                request.getLandId(),
                request.getOwnerName(),
                request.getLocation(),
                BigInteger.valueOf(request.getArea()),
                request.getDocumentHash()
            ).send();
            return ResponseEntity.ok("Land registered successfully. Transaction hash: " + receipt.getTransactionHash());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error registering land: " + e.getMessage());
        }
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
