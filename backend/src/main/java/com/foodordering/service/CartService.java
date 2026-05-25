package com.foodordering.service;

import com.foodordering.dto.request.CartAddRequest;
import com.foodordering.dto.response.CartResponse;
import com.foodordering.entity.*;
import com.foodordering.exception.BadRequestException;
import com.foodordering.exception.ResourceNotFoundException;
import com.foodordering.repository.CartItemRepository;
import com.foodordering.repository.CartRepository;
import com.foodordering.util.MapperUtil;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final MenuService menuService;

    public CartResponse getCart() {
        Cart cart = getOrCreateCart();
        return MapperUtil.toCartResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(CartAddRequest request) {
        User user = SecurityUtil.getCurrentUser();
        Cart cart = cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));

        MenuItem menuItem = menuService.getMenuItemOrThrow(request.getMenuItemId());
        Restaurant restaurant = menuItem.getRestaurant();

        if (!MapperUtil.isVisibleToCustomer(restaurant.getStatus())) {
            throw new BadRequestException("Restaurant not approved");
        }
        if (!MapperUtil.canAcceptOrders(restaurant.getStatus())) {
            throw new BadRequestException("Restaurant is closed");
        }
        if (!Boolean.TRUE.equals(menuItem.getAvailable())) {
            throw new BadRequestException("Menu item is not available");
        }

        if (cart.getRestaurant() != null && !cart.getRestaurant().getId().equals(restaurant.getId())) {
            throw new BadRequestException("Cart can only contain items from one restaurant. Clear cart first.");
        }

        cart.setRestaurant(restaurant);

        CartItem existing = cart.getItems().stream()
                .filter(ci -> ci.getMenuItem().getId().equals(menuItem.getId()))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
        } else {
            CartItem cartItem = CartItem.builder()
                    .cart(cart)
                    .menuItem(menuItem)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(cartItem);
        }

        cartRepository.save(cart);
        return MapperUtil.toCartResponse(cart);
    }

    @Transactional
    public CartResponse updateQuantity(Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCart();
        CartItem item = cart.getItems().stream()
                .filter(ci -> ci.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(quantity);
        }

        if (cart.getItems().isEmpty()) {
            cart.setRestaurant(null);
        }

        cartRepository.save(cart);
        return MapperUtil.toCartResponse(cart);
    }

    @Transactional
    public CartResponse removeFromCart(Long cartItemId) {
        return updateQuantity(cartItemId, 0);
    }

    @Transactional
    public void clearCart(Cart cart) {
        cart.getItems().clear();
        cart.setRestaurant(null);
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart() {
        User user = SecurityUtil.getCurrentUser();
        return cartRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
    }
}
