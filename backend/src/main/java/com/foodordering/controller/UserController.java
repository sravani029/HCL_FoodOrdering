package com.foodordering.controller;

import com.foodordering.dto.response.ApiResponse;
import com.foodordering.entity.User;
import com.foodordering.repository.UserRepository;
import com.foodordering.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfile() {
        User user = SecurityUtil.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "id", user.getId(),
                "name", user.getName(),
                "email", user.getEmail(),
                "phone", user.getPhone(),
                "role", user.getRole(),
                "address", user.getAddress() != null ? user.getAddress() : ""
        )));
    }

    @PutMapping("/address")
    @Transactional
    public ResponseEntity<ApiResponse<Map<String, String>>> updateAddress(@RequestBody Map<String, String> body) {
        User user = SecurityUtil.getCurrentUser();
        user.setAddress(body.get("address"));
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(Map.of("address", user.getAddress())));
    }
}
