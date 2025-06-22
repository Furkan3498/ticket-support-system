package com.furkanceylan.ticketmanagement.dto;

import java.time.LocalDateTime;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TicketResponseDto {
  private Long id;
  private String title;
  private String description;
  private String category;
  private String status;
  private String adminResponse;
  private String createdBy;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}

