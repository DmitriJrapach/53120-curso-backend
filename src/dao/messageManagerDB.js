import messageModel from "../dao/models/messageModel.js";

class messageManagerDB {
  async getAllMessages() {
    try {
      const messages = await messageModel.find();
      return messages;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al obtener los mensajes");
    }
  }

  async getMessageById(id) {
    try {
      const message = await messageModel.findById(id);
      if (!message) {
        throw new Error("Mensaje no encontrado");
      }
      return message;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al obtener el mensaje");
    }
  }

  async insertMessage(messageData) {
    try {
      const newMessage = new messageModel(messageData); 
      const savedMessage = await newMessage.save();
      return savedMessage;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al guardar el mensaje");
    }
  }

  async updateMessage(id, newData) {
    try {
      const updatedMessage = await messageModel.findByIdAndUpdate(id, newData, { new: true });
      if (!updatedMessage) {
        throw new Error("Mensaje no encontrado");
      }
      return updatedMessage;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al actualizar el mensaje");
    }
  }

  async deleteMessage(id) {
    try {
      const deletedMessage = await messageModel.findByIdAndDelete(id);
      if (!deletedMessage) {
        throw new Error("Mensaje no encontrado");
      }
      return deletedMessage;
    } catch (error) {
      console.error(error.message);
      throw new Error("Error al eliminar el mensaje");
    }
  }
}

export { messageManagerDB };