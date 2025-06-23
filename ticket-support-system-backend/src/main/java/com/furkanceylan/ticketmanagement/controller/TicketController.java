package com.furkanceylan.ticketmanagement.controller;
import com.furkanceylan.ticketmanagement.dto.TicketRequestDto;
import com.furkanceylan.ticketmanagement.dto.TicketResponseDto;
import com.furkanceylan.ticketmanagement.entity.TicketStatus;
import com.furkanceylan.ticketmanagement.service.TicketService;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
@RestController
@RequestMapping("/api/tickets")
public class TicketController {
  @Autowired private TicketService ticketService;

  @PostMapping
  public ResponseEntity<TicketResponseDto> createTicket(@RequestBody TicketRequestDto dto, Principal principal) {
    return ResponseEntity.ok(ticketService.createTicket(dto, principal.getName()));
  }

  @GetMapping
  public ResponseEntity<List<TicketResponseDto>> getMyTickets(Principal principal) {
    return ResponseEntity.ok(ticketService.getUserTickets(principal.getName()));
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<List<TicketResponseDto>> listTicketsByStatus(@RequestParam(required = false) TicketStatus status) {
    if (status == null) {
      return ResponseEntity.ok(ticketService.getAllTickets());
    } else {
      return ResponseEntity.ok(ticketService.getTicketsByStatus(status));
    }
  }

  @PostMapping("/admin/{id}/respond")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TicketResponseDto> respondToTicket(@PathVariable Long id, @RequestBody String response) {
    return ResponseEntity.ok(ticketService.respondToTicket(id, response));
  }

  @PostMapping("/admin/{id}/status")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<TicketResponseDto> updateTicketStatus(@PathVariable Long id, @RequestBody String status) {
    return ResponseEntity.ok(ticketService.updateTicketStatus(id, status));
  }
}