// src/routes/ticketRouter.js
import { Router } from 'express';
import ticketController from '../controllers/ticketController.js';

const router = Router();

// Obtener todos los tickets
router.get("/", ticketController.getAllTickets);

// Obtener un ticket por ID
router.get("/:tid", ticketController.getTicketById);

// Crear un nuevo ticket
router.post("/", ticketController.createTicket);

export default router;
