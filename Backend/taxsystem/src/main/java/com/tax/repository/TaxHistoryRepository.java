package com.tax.repository;

import com.tax.model.TaxHistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

import java.util.List;

public interface TaxHistoryRepository
        extends JpaRepository<TaxHistory, Long> {

    List<TaxHistory> findByUsername(String username);

    @Modifying
    @Transactional
    @Query(
        "DELETE FROM TaxHistory t " +
        "WHERE t.username = :username"
    )
    void clearHistory(
            @Param("username")
            String username
    );
}