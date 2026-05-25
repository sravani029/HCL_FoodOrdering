package com.foodordering.service;

import com.foodordering.dto.response.MenuItemResponse;
import com.foodordering.entity.MenuItem;
import com.foodordering.entity.Restaurant;
import com.foodordering.entity.User;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.exception.UnauthorizedException;
import com.foodordering.repository.MenuItemRepository;
import com.foodordering.util.FileStorageUtil;
import com.foodordering.util.MapperUtil;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final RestaurantService restaurantService;
    private final FileStorageUtil fileStorageUtil;

    public List<MenuItemResponse> getMenuByRestaurant(Long restaurantId) {
        Restaurant restaurant = restaurantService.getRestaurantOrThrow(restaurantId);
        if (!MapperUtil.isVisibleToCustomer(restaurant.getStatus())) {
            throw new BadRequestException("Restaurant not approved");
        }
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(MapperUtil::toMenuItemResponse)
                .collect(Collectors.toList());
    }

    public List<MenuItemResponse> getOwnerMenu(Long restaurantId) {
        validateOwnerAccess(restaurantId);
        return menuItemRepository.findByRestaurantId(restaurantId).stream()
                .map(MapperUtil::toMenuItemResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MenuItemResponse addMenuItem(Long restaurantId, String name, Double price,
                                      String category, Boolean available, MultipartFile image) {
        Restaurant restaurant = validateOwnerAccess(restaurantId);
        MenuItem item = MenuItem.builder()
                .name(name)
                .image(fileStorageUtil.storeFile(image, "menu"))
                .price(price)
                .category(category)
                .available(available != null ? available : true)
                .restaurant(restaurant)
                .build();
        return MapperUtil.toMenuItemResponse(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemResponse updateMenuItem(Long id, String name, Double price, String category,
                                           Boolean available, MultipartFile image) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        validateOwnerAccess(item.getRestaurant().getId());

        if (name != null) item.setName(name);
        if (price != null) item.setPrice(price);
        if (category != null) item.setCategory(category);
        if (available != null) item.setAvailable(available);
        if (image != null && !image.isEmpty()) {
            item.setImage(fileStorageUtil.storeFile(image, "menu"));
        }
        return MapperUtil.toMenuItemResponse(menuItemRepository.save(item));
    }

    @Transactional
    public void deleteMenuItem(Long id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
        validateOwnerAccess(item.getRestaurant().getId());
        menuItemRepository.delete(item);
    }

    public MenuItem getMenuItemOrThrow(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Menu item not found"));
    }

    private Restaurant validateOwnerAccess(Long restaurantId) {
        User owner = SecurityUtil.getCurrentUser();
        Restaurant restaurant = restaurantService.getRestaurantOrThrow(restaurantId);
        if (!restaurant.getOwner().getId().equals(owner.getId())) {
            throw new UnauthorizedException("Unauthorized access");
        }
        return restaurant;
    }
}
