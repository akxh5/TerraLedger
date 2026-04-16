package com.terraledger.blockchain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LandRepository extends JpaRepository<LandEntity, Long> {
    List<LandEntity> findByWalletAddress(String walletAddress);
}
