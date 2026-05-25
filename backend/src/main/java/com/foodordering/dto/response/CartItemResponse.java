package com.foodordering.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {
    private Long id;
    private Long menuItemId;
    private String name;
    private String image;
    private Double price;
    private Integer quantity;
    private Double subtotal;
}
