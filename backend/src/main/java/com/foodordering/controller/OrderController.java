package com.foodordering.controller;

import com.foodordering.dto.request.PlaceOrderRequest;
import com.foodordering.dto.response.ApiResponse;
import com.foodordering.dto.response.OrderResponse;
import com.foodordering.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping("/orders/history")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrderHistory() {
        return ResponseEntity.ok(ApiResponse.success(orderService.getCustomerOrders()));
    }

    @PostMapping("/orders/place")
    public ResponseEntity<ApiResponse<OrderResponse>> placeOrder(@Valid @RequestBody PlaceOrderRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Order placed", orderService.placeOrder(request)));
    }

    @PostMapping("/orders/cancel/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Order cancelled", orderService.cancelOrder(id)));
    }
}
