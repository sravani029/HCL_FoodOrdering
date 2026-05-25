package com.foodordering.util;

import com.foodordering.dto.response.*;
import com.foodordering.entity.*;
import com.foodordering.enums.OrderStatus;
import com.foodordering.enums.RestaurantStatus;
import com.foodordering.repository.RatingRepository;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public final class MapperUtil {

    private static final int CANCEL_WINDOW_SECONDS = 45;

    private MapperUtil() {}

    public static RestaurantResponse toRestaurantResponse(Restaurant r) {
        return RestaurantResponse.builder()
                .id(r.getId())
                .name(r.getName())
                .image(r.getImage())
                .rating(r.getRating())
                .deliveryTime(r.getDeliveryTime())
                .status(r.getStatus())
                .ownerId(r.getOwner() != null ? r.getOwner().getId() : null)
                .ownerName(r.getOwner() != null ? r.getOwner().getName() : null)
                .build();
    }

    public static MenuItemResponse toMenuItemResponse(MenuItem m) {
        return MenuItemResponse.builder()
                .id(m.getId())
                .name(m.getName())
                .image(m.getImage())
                .price(m.getPrice())
                .category(m.getCategory())
                .available(m.getAvailable())
                .restaurantId(m.getRestaurant().getId())
                .build();
    }

    public static CartResponse toCartResponse(Cart cart) {
        List<CartItemResponse> items = cart.getItems().stream()
                .map(ci -> CartItemResponse.builder()
                        .id(ci.getId())
                        .menuItemId(ci.getMenuItem().getId())
                        .name(ci.getMenuItem().getName())
                        .image(ci.getMenuItem().getImage())
                        .price(ci.getMenuItem().getPrice())
                        .quantity(ci.getQuantity())
                        .subtotal(ci.getMenuItem().getPrice() * ci.getQuantity())
                        .build())
                .collect(Collectors.toList());
        double total = items.stream().mapToDouble(CartItemResponse::getSubtotal).sum();
        return CartResponse.builder()
                .cartId(cart.getId())
                .restaurantId(cart.getRestaurant() != null ? cart.getRestaurant().getId() : null)
                .restaurantName(cart.getRestaurant() != null ? cart.getRestaurant().getName() : null)
                .items(items)
                .total(total)
                .build();
    }

    public static OrderResponse toOrderResponse(FoodOrder order, RatingRepository ratingRepository) {
        boolean canCancel = order.getStatus() == OrderStatus.PLACED
                && Duration.between(order.getPlacedAt(), LocalDateTime.now()).getSeconds() <= CANCEL_WINDOW_SECONDS;
        boolean rated = ratingRepository.existsByOrderId(order.getId());
        boolean canRate = order.getStatus() == OrderStatus.COMPLETED && !rated;

        List<OrderItemResponse> items = order.getItems().stream()
                .map(oi -> OrderItemResponse.builder()
                        .menuItemId(oi.getMenuItem().getId())
                        .name(oi.getMenuItem().getName())
                        .quantity(oi.getQuantity())
                        .price(oi.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .restaurantId(order.getRestaurant().getId())
                .restaurantName(order.getRestaurant().getName())
                .deliveryAddress(order.getDeliveryAddress())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .paymentMethod(order.getPaymentMethod())
                .placedAt(order.getPlacedAt())
                .canCancel(canCancel)
                .canRate(canRate)
                .rated(rated)
                .items(items)
                .build();
    }

    public static boolean isVisibleToCustomer(RestaurantStatus status) {
        return status == RestaurantStatus.APPROVED
                || status == RestaurantStatus.OPEN
                || status == RestaurantStatus.CLOSED;
    }

    public static boolean canAcceptOrders(RestaurantStatus status) {
        return status == RestaurantStatus.OPEN;
    }
}
