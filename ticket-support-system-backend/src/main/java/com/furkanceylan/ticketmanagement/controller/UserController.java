package com.furkanceylan.ticketmanagement.controller;

import com.furkanceylan.ticketmanagement.configuration.JwtUtil;
import com.furkanceylan.ticketmanagement.dto.LoginRequestDto;
import com.furkanceylan.ticketmanagement.dto.LoginResponseDto;
import com.furkanceylan.ticketmanagement.dto.RegisterRequestDto;
import com.furkanceylan.ticketmanagement.entity.Role;
import com.furkanceylan.ticketmanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class UserController {

  @Autowired
  private UserService userService;
  @Autowired private JwtUtil jwtUtil;
  @Autowired private AuthenticationManager authenticationManager;

  @PostMapping("/register")
  public ResponseEntity<String> register(@RequestBody RegisterRequestDto request) {
    userService.register(request.getUsername(), request.getPassword(), Role.USER);
    return ResponseEntity.ok("Kayıt başarılı");
  }

  @PostMapping("/login")
  public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
    Authentication auth = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
    String token = jwtUtil.generateToken(auth);
    return ResponseEntity.ok(new LoginResponseDto(token));
  }
}
