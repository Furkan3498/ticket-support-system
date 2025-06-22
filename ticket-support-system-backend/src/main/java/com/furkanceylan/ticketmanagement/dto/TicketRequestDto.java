package com.furkanceylan.ticketmanagement.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TicketRequestDto {
  private String title;
  private String description;
  private String category;
}
