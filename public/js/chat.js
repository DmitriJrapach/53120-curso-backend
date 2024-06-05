// const socket = io();

// function initializeChat() {
//     let user;
//     let chatBox = document.querySelector("#chatBox");
//     let messagesLogs = document.querySelector("#messagesLogs");

//     Swal.fire({
//         title: "Identificate",
//         input: "text",
//         text: "Ingresa el usuario para identificarte en el Chat de usuarios",
//         inputValidator: (value) => {
//             return !value && "¡Necesitas identificarte para continuar!";
//         },
//         allowOutsideClick: false
//     }).then(result => {
//         user = result.value;
//         console.log(`Tu nombre de usuario es ${user}`);
    
//         // Emitir evento de conexión de usuario al servidor WebSocket
//         socket.emit("userConnect", user);
    
//         // Llamada a una función para obtener los mensajes del chat usando la API RESTful
//         getChatMessages()
//             .then(messages => {
//                 displayMessages(messages);
//             })
//             .catch(error => console.error('Error cargando mensajes de chat:', error));
//     });

//     // Evento para enviar mensajes en el chat
//     chatBox.addEventListener("keypress", e => {
//         if (e.key == "Enter") {
//             if (chatBox.value.trim().length > 0) {
//                 console.log(`Mensaje: ${chatBox.value}`);

//                 // Emitir evento de mensaje al servidor WebSocket
//                 socket.emit("message", {
//                     user,
//                     message: chatBox.value
//                 });

//                 // Llamada a una función para enviar el mensaje a través de la API RESTful
//                 sendMessage(user, chatBox.value);

//                 chatBox.value = "";
//             }
//         }
//     });

//     // Manejar mensajes recibidos del servidor WebSocket
//     socket.on("messages", data => {
//         console.log("Mensajes recibidos del servidor:", data);
//         displayMessages(data);
//     });

//     // Manejador de eventos para recibir notificaciones de nuevos usuarios en el chat
//     socket.on("newUser", data => {
//         Swal.fire({
//             text: `${data} se ha unido al chat`,
//             toast: true,
//             position: "top-right"
//         });
//     });
// }

// // Función para mostrar los mensajes en el chat
// function displayMessages(messages) {
//     let html = "";
//     messages.forEach(message => {
//         html += `${message.user}: ${message.message} </br>`;
//     });
//     messagesLogs.innerHTML = html;
// }

// // Función para enviar un mensaje a través de la API RESTful
// function sendMessage(user, message) {
//     fetch('/api/messages', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             user,
//             message
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.status === 'success') {
//             console.log('Mensaje enviado exitosamente:', data.payload);
//         } else {
//             console.error('Error al enviar el mensaje:', data.message);
//         }
//     })
//     .catch(error => console.error('Error al enviar el mensaje:', error));
// }

// // Función para obtener los mensajes del chat a través de la API RESTful
// function getChatMessages() {
//     return fetch('/api/messages')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Error al obtener los mensajes del chat');
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.status === 'success') {
//                 return data.payload;
//             } else {
//                 throw new Error(data.message);
//             }
//         });
// }

// export { initializeChat };
