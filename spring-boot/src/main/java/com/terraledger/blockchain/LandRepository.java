package com.terraledger.blockchain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface LandRepository extends JpaRepository<LandEntity, Long> {
    List<LandEntity> findByOwnerAddress(String ownerAddress);
    
    @Query("SELECT l FROM LandEntity l WHERE " +
           "LOWER(l.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.ownerAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(l.citizenId) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<LandEntity> searchLands(@Param("query") String query);

    List<LandEntity> findFirst5ByOrderByCreatedAtDesc();
}
