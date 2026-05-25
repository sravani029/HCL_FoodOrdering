package com.foodordering.util;

import com.foodordering.entity.User;
import com.foodordering.exception.UnauthorizedException;
import com.foodordering.security.CustomUserDetails;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class SecurityUtil {

    private SecurityUtil() {}

    public static User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserDetails details)) {
            throw new UnauthorizedException("Unauthorized access");
        }
        return details.getUser();
    }
}
