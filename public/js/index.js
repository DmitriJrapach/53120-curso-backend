
const socket = io();

function $(selector) {
    return document.querySelector(selector);
}

socket.on('statusError', data => {
    console.log(data);
    alert(data);
});

socket.on('publishProducts', data => {
    $('.products-box').innerHTML = '';

    let html = '';
    data.forEach(product => {
        html += `<div class="product-card">
                    <h3>${product.title}</h3>
                    <hr>
                    <p>Categoria: ${product.category}</p>
                    <p>Descripción: ${product.description}</p>
                    <p>Precio: $ ${product.price}</p>
                    <button id="button-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>`;
    });

    $('.products-box').innerHTML = html;
});

function createProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: $('#title').value,
        description: $('#description').value,
        code: $('#code').value,
        price: $('#price').value,
        stock: $('#stock').value,
        category: $('#category').value
    }

    cleanForm();

    socket.emit('createProduct', newProduct);
}

function deleteProduct(pid) {
    socket.emit('deleteProduct', { pid });
}

function cleanForm() {
    $('#title').value = '';
    $('#description').value = '';
    $('#code').value = '';
    $('#price').value = '';
    $('#stock').value = '';
    $('#category').value = '';
}
// Evento para identificar al usuario y manejar el chat
document.addEventListener("DOMContentLoaded", () => {
   
    let user;
    let chatBox = document.querySelector("#chatBox");
    let messagesLogs = document.querySelector("#messagesLogs");
    
    Swal.fire({
        title: "Identificate",
        input: "text",
        text: "Ingresa el usuario para identificarte en el Chat de usuarios",
        inputValidator: (value) => {
            return !value && "¡Necesitas identificarte para continuar!";
        },
        allowOutsideClick: false
    }).then(result => {
        user = result.value;
        console.log(`Tu nombre de usuario es ${user}`);
    
        // Emitir evento de conexión de usuario al servidor WebSocket
        socket.emit("userConnect", user);
    });
    
    // Evento para enviar mensajes en el chat
    chatBox.addEventListener("keypress", e => {
        if (e.key == "Enter") {
            if (chatBox.value.trim().length > 0) {
                console.log(`Mensaje: ${chatBox.value}`);
    
                // Emitir evento de mensaje al servidor WebSocket
                socket.emit("message", {
                    user,
                    message: chatBox.value
                });
    
                chatBox.value = "";
            }
        }
    });
    
    socket.on("messages", data => {
        console.log("Mensajes recibidos del servidor:", data);
        let messages = "";
    
        // Verificar si data es un array antes de intentar iterar sobre él
        if (Array.isArray(data)) {
            data.forEach(chat => {
                messages += `${chat.user}: ${chat.message} </br>`;
            });
        } else {
            console.error("Data received is not an array:", data);
        }
    
        messagesLogs.innerHTML = messages;
        console.log("mensaje recibido");
    });
    // Manejador de eventos para recibir notificaciones de nuevos usuarios en el chat
    socket.on("newUser", data => {
        Swal.fire({
            text: `${data} se ha unido al chat`,
            toast: true,
            position: "top-right"
        })
    });


});
