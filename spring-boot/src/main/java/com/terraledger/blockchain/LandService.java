package com.terraledger.blockchain;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.web3j.protocol.core.methods.response.TransactionReceipt;

import java.math.BigInteger;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
public class LandService {

    private final LandRequestRepository landRequestRepository;
    private final LandRepository landRepository;
    private final TerraLedgerService terraLedgerService;

    public LandService(LandRequestRepository landRequestRepository, LandRepository landRepository, TerraLedgerService terraLedgerService) {
        this.landRequestRepository = landRequestRepository;
        this.landRepository = landRepository;
        this.terraLedgerService = terraLedgerService;
    }

    @Transactional
    public String approveAndRegisterOnChain(UUID id) throws Exception {
        LandRequestEntity landRequest = landRequestRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Request not found"));

        if (!"PENDING".equals(landRequest.getStatus())) {
            throw new IllegalStateException("Request is not PENDING");
        }

        TransactionReceipt receipt = terraLedgerService.registerLand(
                landRequest.getId().toString(),
                landRequest.getOwnerAddress(),
                landRequest.getLocation(),
                BigInteger.valueOf(landRequest.getArea()),
                landRequest.getDocumentHash()
        ).send();

        if (!receipt.isStatusOK()) {
            throw new RuntimeException("Blockchain transaction reverted");
        }

        landRequest.setStatus("APPROVED");
        landRequest.setTransactionHash(receipt.getTransactionHash());
        landRequest.setApprovedAt(LocalDateTime.now());
        landRequestRepository.save(landRequest);

        LandEntity approvedLand = new LandEntity();
        approvedLand.setOwnerAddress(landRequest.getOwnerAddress());
        approvedLand.setLocation(landRequest.getLocation());
        approvedLand.setArea(landRequest.getArea());
        approvedLand.setDocumentHash(landRequest.getDocumentHash());
        approvedLand.setCitizenId(landRequest.getCitizenId());
        approvedLand.setTransactionHash(receipt.getTransactionHash());
        approvedLand.setCreatedAt(LocalDateTime.now());
        approvedLand.setBlockchainLandId(landRequest.getId().toString());

        landRepository.save(approvedLand);

        return receipt.getTransactionHash();
    }
}
