package com.foodordering.controller;

import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.MenuItemResponse;
import com.foodordering.dto.response.OrderResponse;
import com.foodordering.dto.response.RestaurantResponse;
import com.foodordering.enums.RestaurantStatus;
import com.foodordering.service.MenuService;
import com.foodordering.service.OrderService;
import com.foodordering.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/owner")
@RequiredArgsConstructor
public class OwnerController {

    private final RestaurantService restaurantService;
    private final MenuService menuService;
    private final OrderService orderService;

    @GetMapping("/restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getMyRestaurants() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getOwnerRestaurants()));
    }

    @PostMapping("/restaurants/add")
    public ResponseEntity<ApiResponse<RestaurantResponse>> addRestaurant(
            @RequestParam String name,
            @RequestParam Double rating,
            @RequestParam Integer deliveryTime,
            @RequestParam MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.success(
                restaurantService.addRestaurant(name, rating, deliveryTime, image)));
    }

    @PutMapping("/restaurants/update/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Integer deliveryTime,
            @RequestParam(required = false) RestaurantStatus status,
            @RequestParam(required = false) MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.success(
                restaurantService.updateRestaurant(id, name, rating, deliveryTime, status, image)));
    }

    @GetMapping("/menu/{restaurantId}")
    public ResponseEntity<ApiResponse<List<MenuItemResponse>>> getMenu(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(ApiResponse.success(menuService.getOwnerMenu(restaurantId)));
    }

    @PostMapping("/menu/add")
    public ResponseEntity<ApiResponse<MenuItemResponse>> addMenuItem(
            @RequestParam Long restaurantId,
            @RequestParam String name,
            @RequestParam Double price,
            @RequestParam String category,
            @RequestParam(required = false, defaultValue = "true") Boolean available,
            @RequestParam MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.success(
                menuService.addMenuItem(restaurantId, name, price, category, available, image)));
    }

    @PutMapping("/menu/update/{id}")
    public ResponseEntity<ApiResponse<MenuItemResponse>> updateMenuItem(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Double price,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) MultipartFile image) {
        return ResponseEntity.ok(ApiResponse.success(
                menuService.updateMenuItem(id, name, price, category, available, image)));
    }

    @DeleteMapping("/menu/delete/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMenuItem(@PathVariable Long id) {
        menuService.deleteMenuItem(id);
        return ResponseEntity.ok(ApiResponse.success("Menu item deleted", null));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrders() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOwnerOrders()));
    }

    @PutMapping("/orders/complete/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> completeOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order completed", orderService.completeOrder(id)));
    }
}
