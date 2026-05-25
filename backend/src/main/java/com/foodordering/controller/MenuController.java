package com.foodordering.controller;

import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.MenuItemResponse;
import com.foodordering.service.MenuService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/menu/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getMenuByRestaurant(restaurantId)));
    }
}
