package com.foodordering.controller;

import com.foodordering.dto.request.CartAddRequest;
import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.CartResponse;
import com.foodordering.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/cart")
    public ResponseEntity<ApiResponse<CartResponse>> getCart() {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart()));
    }

    @PostMapping("/cart/add")
    public ResponseEntity<ApiResponse<CartResponse>> addToCart(@Valid @RequestBody CartAddRequest request) {
        return ResponseEntity.ok(ApiResponse.success(cartService.addToCart(request)));
    }

    @PutMapping("/cart/update/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> updateQuantity(
            @PathVariable Long cartItemId, @RequestParam Integer quantity) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateQuantity(cartItemId, quantity)));
    }

    @DeleteMapping("/cart/remove/{cartItemId}")
    public ResponseEntity<ApiResponse<CartResponse>> removeFromCart(@PathVariable Long cartItemId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.removeFromCart(cartItemId)));
    }
}
