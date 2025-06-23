package com.furkanceylan.ticketmanagement.service;

import com.furkanceylan.ticketmanagement.entity.Role;
import com.furkanceylan.ticketmanagement.entity.User;
import com.furkanceylan.ticketmanagement.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public void register(String username, String password, Role role) {
    User user = new User();
    user.setUsername(username);
    user.setPassword(passwordEncoder.encode(password));
    user.setRole(role);
    userRepository.save(user);
  }
}