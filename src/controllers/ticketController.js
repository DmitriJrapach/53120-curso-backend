// src/controllers/ticketController.js
import ticketService from '../services/ticketService.js';

class TicketController {
  async getAllTickets(req, res) {
    const { limit, page, query, sort } = req.query;
    try {
      const result = await ticketService.getAllTickets(limit, page, query, sort);
      res.send({ status: "success", payload: result });
    } catch (error) {
      req.logger.warning ('Error en el controlador al obtener los tickets:', error);
      res.status(500).send({ status: "error", message: "Error fetching tickets" });
    }
  }

  async getTicketById(req, res) {
    const { tid } = req.params;
    try {
      const result = await ticketService.getTicketById(tid);
      if (!result) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.send({ status: "success", payload: result });
    } catch (error) {
      req.logger.warning ('Error en el controlador al obtener el ticket:', error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async createTicket(req, res) {
    try {
      const { purchaseDateTime, amount, purchaser } = req.body;
      const ticketData = { purchaseDateTime, amount, purchaser };
      const newTicket = await ticketService.createTicket(ticketData);
      res.send({ status: "success", payload: newTicket });
    } catch (error) {
      req.logger.warning ('Error en el controlador al crear el ticket:', error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async updateTicket(req, res) {
    const { tid } = req.params;
    const updateData = req.body;
    try {
      const updatedTicket = await ticketService.updateTicket(tid, updateData);
      if (!updatedTicket) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.send({ status: "success", payload: updatedTicket });
    } catch (error) {
      req.logger.warning ('Error en el controlador al actualizar el ticket:', error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }

  async deleteTicket(req, res) {
    const { tid } = req.params;
    try {
      const deletedTicket = await ticketService.deleteTicket(tid);
      if (!deletedTicket) throw new Error(`Ticket with ID ${tid} does not exist!`);
      res.send({ status: "success", payload: deletedTicket });
    } catch (error) {
      req.logger.warning ('Error en el controlador al eliminar el ticket:', error);
      res.status(400).send({ status: "error", message: error.message });
    }
  }
}

export default new TicketController();
