package com.tax.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        System.out.println(
                request.getMethod()
                        + " -> "
                        + request.getRequestURI()
        );

        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(
                request.getMethod())) {

            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }

        String path =
                request.getRequestURI();

        System.out.println(
                "PATH = " + path
        );

        // Public APIs
        if (path.startsWith("/auth")
                || path.startsWith("/tax/history")) {

            System.out.println(
                    "JWT FILTER BYPASSED FOR: "
                            + path
            );

            filterChain.doFilter(
                    request,
                    response
            );
            return;
        }

        String authHeader =
                request.getHeader(
                        "Authorization"
                );

        if (authHeader == null
                || !authHeader.startsWith(
                "Bearer ")) {

            System.out.println(
                    "MISSING TOKEN"
            );

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Missing Token"
            );
            return;
        }

        String token =
                authHeader.substring(7);

        if (!jwtUtil.validateToken(
                token)) {

            System.out.println(
                    "INVALID TOKEN"
            );

            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid Token"
            );
            return;
        }

        System.out.println(
                "VALID TOKEN"
        );

        filterChain.doFilter(
                request,
                response
        );
    }
}