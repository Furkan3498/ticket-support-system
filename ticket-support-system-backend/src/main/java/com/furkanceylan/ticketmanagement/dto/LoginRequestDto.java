package com.furkanceylan.ticketmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginRequestDto {
  private String username;
  private String password;
}