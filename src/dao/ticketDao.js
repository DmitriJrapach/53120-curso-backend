// src/dao/ticketDao.js
import ticketRepository from './repositories/ticketRepository.js';

class TicketDAO {
  async getAllTickets(limit, page, query, sort) {
    try {
      return await ticketRepository.getAllTickets(limit, page, query, sort);
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      return await ticketRepository.getTicketById(ticketId);
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket) {
    try {
      return await ticketRepository.createTicket(ticket);
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(ticketId, updateData) {
    try {
      return await ticketRepository.updateTicket(ticketId, updateData);
    } catch (error) {
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      return await ticketRepository.deleteTicket(ticketId);
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketDAO();
