// src/dao/ticketDao.js
import ticketModel from './models/ticketModel.js';

class TicketDAO {
  async getAllTickets(limit, page, query, sort) {
    try {
      const tickets = await ticketModel.find(query)
        .sort(sort)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate('purchaser')
        .lean();
      return tickets;
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId).populate('purchaser').lean();
      return ticket;
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketModel.create(ticket);
      return newTicket;
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(ticketId, updateData) {
    try {
      const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, updateData, { new: true }).lean();
      return updatedTicket;
    } catch (error) {
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await ticketModel.findByIdAndDelete(ticketId).lean();
      return deletedTicket;
    } catch (error) {
      throw error;
    }
  }
}

export default new TicketDAO();
