package com.terraledger.blockchain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LandRequestRepository extends JpaRepository<LandRequestEntity, UUID> {
    List<LandRequestEntity> findByOwnerAddress(String ownerAddress);
    List<LandRequestEntity> findByStatus(String status);
    long countByStatus(String status);
}
