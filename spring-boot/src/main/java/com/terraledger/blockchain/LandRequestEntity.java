package com.terraledger.blockchain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "land_requests")
public class LandRequestEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String ownerAddress;
    private String location;
    private Long area;
    private String documentHash;
    private String citizenId;

    private String status = "PENDING";
    private String transactionHash;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime approvedAt;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getOwnerAddress() { return ownerAddress; }
    public void setOwnerAddress(String ownerAddress) { this.ownerAddress = ownerAddress; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getArea() { return area; }
    public void setArea(Long area) { this.area = area; }

    public String getDocumentHash() { return documentHash; }
    public void setDocumentHash(String documentHash) { this.documentHash = documentHash; }

    public String getCitizenId() { return citizenId; }
    public void setCitizenId(String citizenId) { this.citizenId = citizenId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getApprovedAt() { return approvedAt; }
    public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }
}
