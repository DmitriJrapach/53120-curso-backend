import ProductRepository from "./dao/repositories/productRepository.js";
import MessageRepository from "./dao/repositories/messageRepository.js";

const productRepository = new ProductRepository();
const messageRepository = new MessageRepository();

export default (io) => {
    // Manejador de eventos para la conexión de WebSocket
    io.on("connection", async (socket) => {
        try {
            // Obtener todos los mensajes al conectarse un nuevo cliente
            const messages = await messageRepository.getAllMessages();
            console.log("Nuevo cliente conectado: ", socket.id);

            // Emitir los mensajes al cliente conectado
            socket.emit("messages", messages);
        } catch (error) {
            console.error("Error al obtener los mensajes:", error);
            // Emitir un mensaje de error al cliente
            socket.emit("statusError", "Error al obtener los mensajes");
        }

        socket.on("message", async (data) => {
            try {
                // Insertar el mensaje en la base de datos
                await messageRepository.insertMessage(data);
        
                // Obtener todos los mensajes actualizados
                const messages = await messageRepository.getAllMessages();
        
                // Emitir los mensajes actualizados a todos los clientes
                io.emit("messages", messages);
            } catch (error) {
                console.error("Error al procesar el mensaje:", error);
                // Emitir un mensaje de error al cliente
                socket.emit("statusError", "Error al procesar el mensaje");
            }
        });

        socket.on("userConnect", data => {
            // Emitir un mensaje a todos los clientes informando que un usuario se ha conectado
            io.emit("newUser", data + " se ha conectado al chat");
        });

        // Evento para crear un nuevo producto
        socket.on("createProduct", async (data) => {
            try {
                await productRepository.createProduct(data);
                const products = await productRepository.getAllProducts();
                // Emitir evento de productos actualizados a todos los clientes
                io.emit("publishProducts", products);
            } catch (error) {
                // Emitir mensaje de error al cliente que intentó crear el producto
                socket.emit("statusError", error.message);
            }
        });

        // Evento para eliminar un producto
        socket.on("deleteProduct", async (data) => {
            try {
                const result = await productRepository.deleteProduct(data.pid);
                // Emitir evento de productos actualizados a todos los clientes
                io.emit("publishProducts", result);
            } catch (error) {
                // Emitir mensaje de error al cliente que intentó eliminar el producto
                socket.emit("statusError", error.message);
            }
        });
    });
};
