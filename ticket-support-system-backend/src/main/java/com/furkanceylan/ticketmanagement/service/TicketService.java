package com.furkanceylan.ticketmanagement.service;

import com.furkanceylan.ticketmanagement.dto.TicketRequestDto;
import com.furkanceylan.ticketmanagement.dto.TicketResponseDto;
import com.furkanceylan.ticketmanagement.entity.Role;
import com.furkanceylan.ticketmanagement.entity.Ticket;
import com.furkanceylan.ticketmanagement.entity.TicketStatus;
import com.furkanceylan.ticketmanagement.entity.User;
import com.furkanceylan.ticketmanagement.exception.ResourceNotFoundException;
import com.furkanceylan.ticketmanagement.mapper.TicketMapper;
import com.furkanceylan.ticketmanagement.repository.TicketRepository;
import com.furkanceylan.ticketmanagement.repository.UserRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TicketService {
  @Autowired
  private TicketRepository ticketRepository;
  @Autowired private UserRepository userRepository;
  @Autowired private TicketMapper ticketMapper;

  public TicketResponseDto createTicket(TicketRequestDto dto, String username) {
    User user = userRepository.findByUsername(username).orElseThrow();
    Ticket ticket = ticketMapper.toEntity(dto);
    ticket.setStatus(TicketStatus.OPEN);
    ticket.setCreatedBy(user);
    return ticketMapper.toDto(ticketRepository.save(ticket));
  }

  public List<TicketResponseDto> getUserTickets(String username) {
    User user = userRepository.findByUsername(username).orElseThrow();
    return ticketRepository.findByCreatedBy(user).stream()
        .map(ticketMapper::toDto).toList();
  }

  public List<TicketResponseDto> getTicketsByStatus(TicketStatus status) {
    return ticketRepository.findByStatus(status).stream()
        .map(ticketMapper::toDto).toList();
  }

  public List<TicketResponseDto> getAllTickets() {
    List<Ticket> tickets = ticketRepository.findAll();
    return tickets.stream()
        .map(ticketMapper::toDto).toList();
  }

  public TicketResponseDto respondToTicket(Long id, String response) {
    Ticket ticket = ticketRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));
    ticket.setAdminResponse(response);
    ticket.setStatus(TicketStatus.ANSWERED);
    return ticketMapper.toDto(ticketRepository.save(ticket));
  }

  public TicketResponseDto updateTicketStatus(Long id, String status) {
    Ticket ticket = ticketRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Ticket not found"));

    ticket.setStatus(TicketStatus.valueOf(status));
    Ticket updatedTicket = ticketRepository.save(ticket);

    return ticketMapper.toDto(updatedTicket);
  }
}