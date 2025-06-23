import axios from "../api/axios";

const TicketService = {
    createTicket: (ticketData) => axios.post("/tickets", ticketData),
    getUserTickets: () => axios.get("/tickets"),
    getAdminTickets: (status) =>
        axios.get("/tickets/admin", { params: { status } }),
    respondTicket: (id, responseData) =>
        axios.post(`/tickets/admin/${id}/respond`, responseData),
updateTicketStatus: (id, newStatus) =>
  axios.post(`/tickets/admin/${id}/status`, JSON.stringify(newStatus), {
    headers: { "Content-Type": "application/json" },
  }),
};

export default TicketService;
