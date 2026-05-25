package com.foodordering.controller;

import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.RestaurantResponse;
import com.foodordering.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getRestaurants(
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getApprovedRestaurants(search)));
    }
}
