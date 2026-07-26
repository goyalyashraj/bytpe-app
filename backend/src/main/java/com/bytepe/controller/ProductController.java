package com.bytepe.controller;

import com.bytepe.model.Product;
import com.bytepe.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getProducts(@RequestParam(required = false) String storeType) {
        if (storeType != null && !storeType.isBlank()) {
            return ResponseEntity.ok(productRepository.findByStoreTypeAndIsActiveTrue(storeType));
        }
        return ResponseEntity.ok(productRepository.findByIsActiveTrue());
    }

    @PostMapping
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("PROD-" + System.currentTimeMillis());
        }
        if (product.getIsActive() == null) {
            product.setIsActive(true);
        }
        Product saved = productRepository.save(product);
        return ResponseEntity.ok(saved);
    }
}
