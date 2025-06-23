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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
  const [responseTexts, setResponseTexts] = useState({});
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");

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

  const handleStatusChange = async (ticketId, statusObject) => {
    setUpdatingStatusId(ticketId);
    try {
      await TicketService.updateTicketStatus(ticketId, statusObject);
      fetchTickets(filterStatus);
    } catch (error) {
      console.error("Error updating ticket status", error);
      alert("Failed to update status");
    }
    setUpdatingStatusId(null);
  };

  const openStatusChangePopup = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setOpenStatusModal(true);
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
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => openStatusChangePopup(ticket)}
                      >
                        {ticket.status}
                      </Button>
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

      <Dialog open={openStatusModal} onClose={() => setOpenStatusModal(false)}>
        <DialogTitle>Change Ticket Status</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="New Status"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            fullWidth
            sx={{ mt: 2 }}
          >
            {statuses.filter(s => s.value !== "").map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              await handleStatusChange(selectedTicket.id, { status: newStatus });
              setOpenStatusModal(false);
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
