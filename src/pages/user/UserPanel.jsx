import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Typography, MenuItem, Paper, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import TicketService from "../../services/TicketService";

const categories = [
  { value: "TECHNICAL", label: "Technical" },
  { value: "BILLING", label: "Billing" },
  { value: "GENERAL", label: "General" },
];

const UserPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await TicketService.getUserTickets();
      setTickets(res.data);
    } catch (error) {
      console.error("Error fetching tickets", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await TicketService.createTicket(values);
        resetForm();
        fetchTickets();
      } catch (error) {
        console.error("Error creating ticket", error);
      }
    },
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create Support Ticket
      </Typography>

      <form onSubmit={formik.handleSubmit} style={{ marginBottom: 40 }}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          margin="normal"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <TextField
          fullWidth
          id="description"
          name="description"
          label="Description"
          margin="normal"
          multiline
          minRows={3}
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <TextField
          select
          fullWidth
          id="category"
          name="category"
          label="Category"
          margin="normal"
          value={formik.values.category}
          onChange={formik.handleChange}
          error={formik.touched.category && Boolean(formik.errors.category)}
          helperText={formik.touched.category && formik.errors.category}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>

        <Button color="primary" variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
          Submit Ticket
        </Button>
      </form>

      <Typography variant="h5" gutterBottom>
        My Tickets
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Admin Response</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.category}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>{ticket.adminResponse || "-"}</TableCell>
                    <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
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

export default UserPanel;
