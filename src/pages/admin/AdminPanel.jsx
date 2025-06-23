import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TextareaAutosize,
} from "@mui/material";
import TicketService from "../../services/TicketService";

const statuses = [
  { value: "", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "ANSWERED", label: "Answered" },
  { value: "CLOSED", label: "Closed" },
];

const AdminPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [filterStatus, setFilterStatus] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [responseTexts, setResponseTexts] = useState({}); // ticketId -> response text
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const fetchTickets = async (status) => {
    setLoading(true);
    try {
      const res = await TicketService.getAdminTickets(status);
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets(filterStatus);
  }, [filterStatus]);

  const handleResponseChange = (ticketId, text) => {
    setResponseTexts((prev) => ({ ...prev, [ticketId]: text }));
  };

  const handleRespond = async (ticketId) => {
    const response = responseTexts[ticketId];
    if (!response || response.trim() === "") {
      alert("Response cannot be empty");
      return;
    }

    try {
      await TicketService.respondTicket(ticketId, { adminResponse: response, status: "ANSWERED" });
      alert("Response sent");
      setResponseTexts((prev) => ({ ...prev, [ticketId]: "" }));
      fetchTickets(filterStatus);
    } catch (error) {
      console.error("Error responding ticket", error);
      alert("Error sending response");
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    setUpdatingStatusId(ticketId);
    try {
      await TicketService.updateTicketStatus(ticketId, newStatus);
      fetchTickets(filterStatus);
    } catch (error) {
      console.error("Error updating ticket status", error);
      alert("Failed to update status");
    }
    setUpdatingStatusId(null);
  };

  const parseAdminResponse = (adminResponse) => {
    if (!adminResponse) return "-";
    try {
      const parsed = JSON.parse(adminResponse);
      return parsed.adminResponse || "-";
    } catch {
      return adminResponse || "-";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Ticket Management
      </Typography>

      <TextField
        select
        label="Filter by Status"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        sx={{ mb: 3, width: 200 }}
      >
        {statuses.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created By</TableCell>
                <TableCell>Admin Response</TableCell>
                <TableCell>Respond</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.description}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>
                      <TextField
                        select
                        size="small"
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        disabled={updatingStatusId === ticket.id}
                        sx={{ minWidth: 100 }}
                      >
                        {statuses
                          .filter((s) => s.value !== "")
                          .map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                      </TextField>
                    </TableCell>
                    <TableCell>{ticket.createdBy}</TableCell>
                    <TableCell>{parseAdminResponse(ticket.adminResponse)}</TableCell>
                    <TableCell>
                      <TextareaAutosize
                        minRows={2}
                        style={{ width: "100%" }}
                        placeholder="Type your response..."
                        value={responseTexts[ticket.id] || ""}
                        onChange={(e) => handleResponseChange(ticket.id, e.target.value)}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRespond(ticket.id)}
                        sx={{ mt: 1 }}
                      >
                        Send
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Box>
  );
};

export default AdminPanel;
