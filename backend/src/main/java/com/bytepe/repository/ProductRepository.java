package com.bytepe.repository;

import com.bytepe.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, String> {
    List<Product> findByStoreTypeAndIsActiveTrue(String storeType);
    List<Product> findByIsActiveTrue();
}
