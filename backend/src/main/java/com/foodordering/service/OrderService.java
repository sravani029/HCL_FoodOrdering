package com.foodordering.service;

import com.foodordering.dto.request.PlaceOrderRequest;
import com.foodordering.dto.response.OrderResponse;
import com.foodordering.entity.*;
import com.foodordering.enums.OrderStatus;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.exception.UnauthorizedException;
import com.foodordering.repository.CartRepository;
import com.foodordering.repository.FoodOrderRepository;
import com.foodordering.repository.RatingRepository;
import com.foodordering.util.MapperUtil;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger("ORDER_LOG");
    private static final int CANCEL_WINDOW_SECONDS = 45;

    private final FoodOrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final EmailService emailService;
    private final RatingRepository ratingRepository;

    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {
        User customer = SecurityUtil.getCurrentUser();
        if (request.getDeliveryAddress() == null || request.getDeliveryAddress().isBlank()) {
            throw new BadRequestException("Delivery address is required");
        }

        Cart cart = cartRepository.findByUserId(customer.getId())
                .orElseThrow(() -> new BadRequestException("Cart is empty"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty");
        }

        Restaurant restaurant = cart.getRestaurant();
        if (!MapperUtil.canAcceptOrders(restaurant.getStatus())) {
            throw new BadRequestException("Restaurant is closed");
        }

        double total = cart.getItems().stream()
                .mapToDouble(ci -> ci.getMenuItem().getPrice() * ci.getQuantity())
                .sum();

        FoodOrder order = FoodOrder.builder()
                .customer(customer)
                .restaurant(restaurant)
                .deliveryAddress(request.getDeliveryAddress())
                .totalAmount(total)
                .status(OrderStatus.PLACED)
                .paymentMethod("COD")
                .build();

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .menuItem(ci.getMenuItem())
                    .quantity(ci.getQuantity())
                    .price(ci.getMenuItem().getPrice())
                    .build();
            order.getItems().add(oi);
        }

        if (customer.getAddress() == null || customer.getAddress().isBlank()) {
            customer.setAddress(request.getDeliveryAddress());
        }

        order = orderRepository.save(order);
        cartService.clearCart(cart);

        log.info("Order placed: #{} by {} for restaurant {}", order.getId(), customer.getEmail(), restaurant.getName());
        emailService.sendOrderConfirmationEmail(order);

        return MapperUtil.toOrderResponse(order, ratingRepository);
    }

    @Transactional
    public OrderResponse cancelOrder(Long orderId) {
        User customer = SecurityUtil.getCurrentUser();
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new UnauthorizedException("Unauthorized access");
        }
        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Order cannot be cancelled");
        }

        long seconds = Duration.between(order.getPlacedAt(), LocalDateTime.now()).getSeconds();
        if (seconds > CANCEL_WINDOW_SECONDS) {
            throw new BadRequestException("Order cancellation expired. Window is 45 seconds.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order = orderRepository.save(order);

        log.info("Order cancelled: #{}", orderId);
        emailService.sendOrderCancellationEmail(order);

        return MapperUtil.toOrderResponse(order, ratingRepository);
    }

    public List<OrderResponse> getCustomerOrders() {
        User customer = SecurityUtil.getCurrentUser();
        return orderRepository.findByCustomerIdOrderByPlacedAtDesc(customer.getId()).stream()
                .map(o -> MapperUtil.toOrderResponse(o, ratingRepository))
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOwnerOrders() {
        User owner = SecurityUtil.getCurrentUser();
        return orderRepository.findByRestaurantOwnerIdOrderByPlacedAtDesc(owner.getId()).stream()
                .map(o -> MapperUtil.toOrderResponse(o, ratingRepository))
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse completeOrder(Long orderId) {
        User owner = SecurityUtil.getCurrentUser();
        FoodOrder order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getRestaurant().getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException("Unauthorized access");
        }
        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Only placed orders can be completed");
        }

        order.setStatus(OrderStatus.COMPLETED);
        order = orderRepository.save(order);
        log.info("Order completed: #{}", orderId);

        return MapperUtil.toOrderResponse(order, ratingRepository);
    }
}
