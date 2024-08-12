// // src/repository/ticketRepository.js
import ticketModel from '../models/ticketModel.js';

class TicketRepository {
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
      const ticket = await ticketModel.findById(ticketId)
        .populate({
          path: 'products.product', // Popula el campo 'product' dentro de 'products'
          model: 'products', // Modelo al que hace referencia
          select: 'title price' // Solo selecciona los campos 'title' y 'price'
        })
        .populate('purchaser', 'name') // Popula el campo 'purchaser' si es necesario
        .lean();
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

export default new TicketRepository();
