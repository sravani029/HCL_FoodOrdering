package com.foodordering.repository;

import com.foodordering.entity.Restaurant;
import com.foodordering.enums.RestaurantStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    List<Restaurant> findByStatusIn(List<RestaurantStatus> statuses);
    List<Restaurant> findByStatus(RestaurantStatus status);
    List<Restaurant> findByOwnerId(Long ownerId);
    long countByStatus(RestaurantStatus status);
    long count();
}
