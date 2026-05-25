package com.foodordering.service;

import com.foodordering.dto.response.AdminStatsResponse;
import com.foodordering.dto.response.RestaurantResponse;
import com.foodordering.entity.Restaurant;
import com.foodordering.entity.User;
import com.foodordering.enums.RestaurantStatus;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.exception.UnauthorizedException;
import com.foodordering.repository.RestaurantRepository;
import com.foodordering.util.FileStorageUtil;
import com.foodordering.util.MapperUtil;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final FileStorageUtil fileStorageUtil;

    public List<RestaurantResponse> getApprovedRestaurants(String search) {
        List<RestaurantStatus> visible = Arrays.asList(
                RestaurantStatus.APPROVED, RestaurantStatus.OPEN, RestaurantStatus.CLOSED);
        return restaurantRepository.findByStatusIn(visible).stream()
                .filter(r -> search == null || search.isBlank()
                        || r.getName().toLowerCase().contains(search.toLowerCase()))
                .map(MapperUtil::toRestaurantResponse)
                .collect(Collectors.toList());
    }

    public List<RestaurantResponse> getOwnerRestaurants() {
        User owner = SecurityUtil.getCurrentUser();
        return restaurantRepository.findByOwnerId(owner.getId()).stream()
                .map(MapperUtil::toRestaurantResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RestaurantResponse addRestaurant(String name, Double rating,
                                            Integer deliveryTime, MultipartFile imageFile) {
        User owner = SecurityUtil.getCurrentUser();
        String imagePath = fileStorageUtil.storeFile(imageFile, "restaurants");
        Restaurant restaurant = Restaurant.builder()
                .name(name)
                .image(imagePath)
                .rating(rating)
                .deliveryTime(deliveryTime)
                .status(RestaurantStatus.PENDING)
                .owner(owner)
                .build();
        return MapperUtil.toRestaurantResponse(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantResponse updateRestaurant(Long id, String name,
                                               Double rating, Integer deliveryTime,
                                               RestaurantStatus status, MultipartFile imageFile) {
        User owner = SecurityUtil.getCurrentUser();
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException("Unauthorized access");
        }

        if (name != null) restaurant.setName(name);
        if (rating != null) restaurant.setRating(rating);
        if (deliveryTime != null) restaurant.setDeliveryTime(deliveryTime);
        if (imageFile != null && !imageFile.isEmpty()) {
            restaurant.setImage(fileStorageUtil.storeFile(imageFile, "restaurants"));
        }
        if (status != null) {
            if (status == RestaurantStatus.OPEN || status == RestaurantStatus.CLOSED) {
                if (restaurant.getStatus() != RestaurantStatus.APPROVED
                        && restaurant.getStatus() != RestaurantStatus.OPEN
                        && restaurant.getStatus() != RestaurantStatus.CLOSED) {
                    throw new BadRequestException("Restaurant must be approved before changing open/closed status");
                }
                restaurant.setStatus(status);
            }
        }

        return MapperUtil.toRestaurantResponse(restaurantRepository.save(restaurant));
    }

    public List<RestaurantResponse> getPendingRestaurants() {
        return restaurantRepository.findByStatus(RestaurantStatus.PENDING).stream()
                .map(MapperUtil::toRestaurantResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public RestaurantResponse approveRestaurant(Long id) {
        Restaurant restaurant = getRestaurantOrThrow(id);
        restaurant.setStatus(RestaurantStatus.APPROVED);
        return MapperUtil.toRestaurantResponse(restaurantRepository.save(restaurant));
    }

    @Transactional
    public RestaurantResponse rejectRestaurant(Long id) {
        Restaurant restaurant = getRestaurantOrThrow(id);
        restaurant.setStatus(RestaurantStatus.REJECTED);
        return MapperUtil.toRestaurantResponse(restaurantRepository.save(restaurant));
    }

    public AdminStatsResponse getAdminStats() {
        return AdminStatsResponse.builder()
                .totalRestaurants(restaurantRepository.count())
                .totalApproved(restaurantRepository.countByStatus(RestaurantStatus.APPROVED)
                        + restaurantRepository.countByStatus(RestaurantStatus.OPEN)
                        + restaurantRepository.countByStatus(RestaurantStatus.CLOSED))
                .totalPending(restaurantRepository.countByStatus(RestaurantStatus.PENDING))
                .build();
    }

    public Restaurant getRestaurantOrThrow(Long id) {
        return restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
    }
}
