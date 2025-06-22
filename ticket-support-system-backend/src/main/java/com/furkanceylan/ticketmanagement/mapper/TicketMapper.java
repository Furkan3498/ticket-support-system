package com.furkanceylan.ticketmanagement.mapper;

import com.furkanceylan.ticketmanagement.dto.TicketRequestDto;
import com.furkanceylan.ticketmanagement.dto.TicketResponseDto;
import com.furkanceylan.ticketmanagement.entity.Ticket;
import java.util.List;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TicketMapper {

  // Request DTO'dan Entity'ye
  @Mapping(target = "createdBy", ignore = true) // Burayı servis katmanında set edeceğiz
  @Mapping(target = "adminResponse", ignore = true)
  @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
  @Mapping(target = "updatedAt", expression = "java(java.time.LocalDateTime.now())")
  Ticket toEntity(TicketRequestDto dto);

  // Entity'den Response DTO'ya
  @Mapping(target = "createdBy", source = "createdBy.username")
  TicketResponseDto toDto(Ticket entity);

  List<TicketResponseDto> toDtoList(List<Ticket> entities);
}

