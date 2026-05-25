package com.foodordering.service;

import com.foodordering.dto.request.LoginRequest;
import com.foodordering.dto.request.SignupRequest;
import com.foodordering.dto.response.AuthResponse;
import com.foodordering.entity.Cart;
import com.foodordering.entity.User;
import com.foodordering.enums.Role;
import com.foodordering.exception.BadRequestException;
import com.foodordering.repository.CartRepository;
import com.foodordering.repository.UserRepository;
import com.foodordering.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger("LOGIN_LOG");

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new BadRequestException("Phone number already registered");
        }
        if (request.getRole() == Role.ADMIN && userRepository.existsByRole(Role.ADMIN)) {
            throw new BadRequestException("Admin already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .address(request.getAddress())
                .build();

        user = userRepository.save(user);

        if (user.getRole() == Role.CUSTOMER) {
            Cart cart = Cart.builder().user(user).build();
            cartRepository.save(cart);
            user.setCart(cart);
        }

        emailService.sendRegistrationEmail(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        log.info("User logged in: {} - role: {}", user.getEmail(), user.getRole());

        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), user.getRole().name());
        return buildAuthResponse(user, token);
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .address(user.getAddress())
                .build();
    }
}
