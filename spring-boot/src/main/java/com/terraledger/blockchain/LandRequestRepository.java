package com.terraledger.blockchain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface LandRequestRepository extends JpaRepository<LandRequestEntity, UUID> {
    List<LandRequestEntity> findByOwnerAddress(String ownerAddress);
    List<LandRequestEntity> findByStatus(String status);
}
