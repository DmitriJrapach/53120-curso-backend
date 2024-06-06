// src/routes/ticketRouter.js
import { Router } from 'express';
import ticketController from '../controllers/ticketController.js';
import { passportCall } from "../utils/authUtil.js";


const router = Router();

router.get("/", async (req, res) => {
  try {
    const tickets = await ticketRepository.getAllTickets();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:tid", async (req, res) => {
  try {
    const ticket = await ticketRepository.getTicketById(req.params.tid);
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newTicket = await ticketRepository.createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;