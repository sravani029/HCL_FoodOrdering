package com.foodordering.dto.response;

import com.foodordering.enums.RestaurantStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {
    private Long id;
    private String name;
    private String image;
    private Double rating;
    private Integer deliveryTime;
    private RestaurantStatus status;
    private Long ownerId;
    private String ownerName;
}
