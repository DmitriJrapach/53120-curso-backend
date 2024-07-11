const socket = io();

function $(selector) {
    return document.querySelector(selector);
}

socket.on('statusError', data => {
    console.log(data);
    alert(data);
});

fetch('/products')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            displayProducts(data.payload); // Mostrar productos directamente al recibir la respuesta
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error cargando productos:', error));

function displayProducts(products) {
    const productsBox = $('.products-box');
    productsBox.innerHTML = '';

    let html = '';
    products.forEach(product => {
        html += `<div class="product-card">
                    <h3>${product.title}</h3>
                    <hr>
                    <p>Categoria: ${product.category}</p>
                    <p>Descripción: ${product.description}</p>
                    <p>Precio: $ ${product.price}</p>
                    <button id="button-delete" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </div>`;
    });

    productsBox.innerHTML = html;
}

function createProduct(event) {
    event.preventDefault();
    const newProduct = {
        title: $('#title').value,
        description: $('#description').value,
        code: $('#code').value,
        price: $('#price').value,
        stock: $('#stock').value,
        category: $('#category').value
    };

    cleanForm();

    fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Producto creado exitosamente');
            
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error creando producto:', error));
}

function deleteProduct(pid) {
    fetch(`/api/products/${pid}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            alert('Producto eliminado exitosamente');
            // En lugar de llamar a loadProducts(), llamamos a displayProducts()
            // para actualizar la lista de productos directamente
            fetch('/products')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        displayProducts(data.payload); // Mostrar productos actualizados
                    } else {
                        alert(`Error: ${data.message}`);
                    }
                })
                .catch(error => console.error('Error cargando productos:', error));
        } else {
            alert(`Error: ${data.message}`);
        }
    })
    .catch(error => console.error('Error eliminando producto:', error));
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
    chatBox.addEventListener("keypress", async (e) => {
        if (e.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                console.log(`Mensaje: ${chatBox.value}`);

                try {
                    const response = await fetch('/api/chat/messages', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            user,
                            message: chatBox.value
                        })
                    });

                    if (response.ok) {
                        console.log('Mensaje enviado exitosamente');
                    } else {
                        throw new Error('Error al enviar el mensaje');
                    }
                } catch (error) {
                    console.error('Error al enviar el mensaje', error);
                }

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
        });
    });
});
