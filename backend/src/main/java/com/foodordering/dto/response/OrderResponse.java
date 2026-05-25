package com.foodordering.dto.response;

import com.foodordering.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Long id;
    private Long restaurantId;
    private String restaurantName;
    private String deliveryAddress;
    private Double totalAmount;
    private OrderStatus status;
    private String paymentMethod;
    private LocalDateTime placedAt;
    private boolean canCancel;
    private boolean canRate;
    private boolean rated;
    private List<OrderItemResponse> items;
}
