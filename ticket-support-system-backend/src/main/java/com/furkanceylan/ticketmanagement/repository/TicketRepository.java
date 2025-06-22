package com.furkanceylan.ticketmanagement.repository;

import com.furkanceylan.ticketmanagement.entity.Ticket;
import com.furkanceylan.ticketmanagement.entity.TicketStatus;
import com.furkanceylan.ticketmanagement.entity.User;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
  List<Ticket> findByCreatedBy(User user);
  List<Ticket> findByStatus(TicketStatus status);
}
