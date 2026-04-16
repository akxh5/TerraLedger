package com.terraledger.blockchain;

import jakarta.persistence.*;

@Entity
@Table(name = "lands")
public class LandEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String landId;
    private String ownerName;
    private String location;
    private Long area;
    private String documentHash;
    private String walletAddress;

    private String status = "PENDING";
    private String transactionHash;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLandId() { return landId; }
    public void setLandId(String landId) { this.landId = landId; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Long getArea() { return area; }
    public void setArea(Long area) { this.area = area; }

    public String getDocumentHash() { return documentHash; }
    public void setDocumentHash(String documentHash) { this.documentHash = documentHash; }

    public String getWalletAddress() { return walletAddress; }
    public void setWalletAddress(String walletAddress) { this.walletAddress = walletAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
}
