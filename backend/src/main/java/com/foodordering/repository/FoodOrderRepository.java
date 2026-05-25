package com.foodordering.repository;

import com.foodordering.entity.FoodOrder;
import com.foodordering.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FoodOrderRepository extends JpaRepository<FoodOrder, Long> {
    List<FoodOrder> findByCustomerIdOrderByPlacedAtDesc(Long customerId);

    @Query("SELECT o FROM FoodOrder o WHERE o.restaurant.owner.id = :ownerId ORDER BY o.placedAt DESC")
    List<FoodOrder> findByRestaurantOwnerIdOrderByPlacedAtDesc(@Param("ownerId") Long ownerId);

    @Query("SELECT o FROM FoodOrder o WHERE o.restaurant.owner.id = :ownerId AND o.status = :status ORDER BY o.placedAt DESC")
    List<FoodOrder> findByRestaurantOwnerIdAndStatusOrderByPlacedAtDesc(
            @Param("ownerId") Long ownerId, @Param("status") OrderStatus status);
}
