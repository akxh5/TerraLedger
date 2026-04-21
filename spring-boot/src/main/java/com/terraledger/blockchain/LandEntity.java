package com.terraledger.blockchain;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lands")
public class LandEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ownerAddress;
    private String location;
    private Long area;
    private String documentHash;
    private String citizenId;
    private String transactionHash;
    private LocalDateTime createdAt;
    
    // We might still want landId from blockchain if it's different from DB id
    private String blockchainLandId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getBlockchainLandId() { return blockchainLandId; }
    public void setBlockchainLandId(String blockchainLandId) { this.blockchainLandId = blockchainLandId; }
}
