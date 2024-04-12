// import { productManagerFS } from "./dao/productManagerFS.js";
// const ProductService = new productManagerFS('products.json');
import { productManagerDB } from "./dao/productManagerDB.js";
import { messageManagerDB } from "./dao/messageManagerDB.js";
import messageModel from "./dao/models/messageModel.js";

const ProductService = new productManagerDB();

export default (io) => {
    // Manejador de eventos para la conexión de WebSocket
    io.on("connection", (socket) => {
           
        const messageManager = new messageManagerDB();
        const messages = []; // Mover la declaración aquí
    
        console.log("Nuevo cliente conectado: ", socket.id);

        socket.on("message", async (data) => {
            try {
                // Insertar el mensaje en la base de datos
                await messageManager.insertMessage(data);

                // Obtener todos los mensajes actualizados
                const messages = await messageManager.getAllMessages(); // Esto es opcional, depende de si quieres obtener todos los mensajes actualizados después de insertar uno nuevo

                // Emitir los mensajes actualizados a todos los clientes
                io.emit("messages", messages);
            } catch (error) {
                console.error("Error al procesar el mensaje:", error);
                // Emitir un mensaje de error al cliente
                socket.emit("statusError", "Error al procesar el mensaje");
            }
        });

        socket.on("userConnect", data => {
            // No estoy seguro de qué hacer aquí, pero si necesitas hacer algo
            // con la información del usuario conectado, puedes hacerlo aquí.
            // socket.broadcast.emit("newUser", data);
        });

        // Evento para crear un nuevo producto
        socket.on("createProduct", async (data) => {
            try {
                await ProductService.createProduct(data);
                const products = await ProductService.getAllProducts();
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
                const result = await ProductService.deleteProduct(data.pid);
                // Emitir evento de productos actualizados a todos los clientes
                io.emit("publishProducts", result);
            } catch (error) {
                // Emitir mensaje de error al cliente que intentó eliminar el producto
                socket.emit("statusError", error.message);
            }
        });
    });
};