package com.foodordering.repository;

import com.foodordering.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByRestaurantId(Long restaurantId);
    Optional<MenuItem> findByIdAndRestaurantOwnerId(Long id, Long ownerId);
}
