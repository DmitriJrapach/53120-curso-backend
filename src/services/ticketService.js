// src/services/ticketService.js
import ticketDAO from "../dao/ticketDao.js";
import ticketDTO from "../dto/ticketDTO.js";

class TicketService {
  async getAllTickets(limit, page, query, sort) {
    try {
      const tickets = await ticketDAO.getAllTickets(limit, page, query, sort);
      return tickets.map((ticket) => new ticketDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketDAO.getTicketById(ticketId);
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      return new ticketDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticketData) {
    try {
      const newTicket = await ticketDAO.createTicket(ticketData);
      return new ticketDTO(newTicket);
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(ticketId, updateData) {
    try {
      const updatedTicket = await ticketDAO.updateTicket(ticketId, updateData);
      if (!updatedTicket) {
        throw new Error(`Ticket with ID ${ticketId} does not exist!`);
      }
      return new ticketDTO(updatedTicket);
    } catch (error) {
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await ticketDAO.deleteTicket(ticketId);
      if (!deletedTicket) {
        throw new Error(`Ticket with ID ${ticketId} does not exist!`);
      }
      return new ticketDTO(deletedTicket);
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketService();
