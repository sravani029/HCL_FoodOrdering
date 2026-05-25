package com.foodordering.service;

import com.foodordering.dto.request.RatingRequest;
import com.foodordering.entity.FoodOrder;
import com.foodordering.entity.Rating;
import com.foodordering.entity.User;
import com.foodordering.enums.OrderStatus;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.exception.UnauthorizedException;
import com.foodordering.repository.FoodOrderRepository;
import com.foodordering.repository.RatingRepository;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final FoodOrderRepository orderRepository;

    @Transactional
    public void addRating(RatingRequest request) {
        User user = SecurityUtil.getCurrentUser();
        FoodOrder order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized access");
        }
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new BadRequestException("Rating allowed only after order is delivered");
        }
        if (ratingRepository.existsByOrderId(order.getId())) {
            throw new BadRequestException("Rating already submitted for this order");
        }

        Rating rating = Rating.builder()
                .order(order)
                .user(user)
                .restaurant(order.getRestaurant())
                .stars(request.getStars())
                .build();

        ratingRepository.save(rating);
        order.setRating(rating);
        orderRepository.save(order);
    }
}
