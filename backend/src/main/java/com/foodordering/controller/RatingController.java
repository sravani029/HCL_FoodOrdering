package com.foodordering.controller;

import com.foodordering.dto.request.RatingRequest;
import com.foodordering.dto.response.ApiResponse;
import com.foodordering.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping("/ratings/add")
    public ResponseEntity<ApiResponse<Void>> addRating(@Valid @RequestBody RatingRequest request) {
        ratingService.addRating(request);
        return ResponseEntity.ok(ApiResponse.success("Rating submitted", null));
    }
}
