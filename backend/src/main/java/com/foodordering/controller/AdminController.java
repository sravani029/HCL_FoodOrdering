package com.foodordering.controller;

import com.foodordering.dto.response.AdminStatsResponse;
import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.RestaurantResponse;
import com.foodordering.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RestaurantService restaurantService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsResponse>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getAdminStats()));
    }

    @GetMapping("/restaurants/pending")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getPending() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getPendingRestaurants()));
    }

    @PutMapping("/restaurants/approve/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> approve(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant approved",
                restaurantService.approveRestaurant(id)));
    }

    @PutMapping("/restaurants/reject/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> reject(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Restaurant rejected",
                restaurantService.rejectRestaurant(id)));
    }
}
