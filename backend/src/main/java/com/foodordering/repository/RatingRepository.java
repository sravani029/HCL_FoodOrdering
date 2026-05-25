package com.foodordering.repository;

import com.foodordering.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    boolean existsByOrderId(Long orderId);
}
