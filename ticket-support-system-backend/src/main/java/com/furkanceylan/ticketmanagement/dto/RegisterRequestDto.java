package com.furkanceylan.ticketmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RegisterRequestDto {
  private String username;
  private String password;
}