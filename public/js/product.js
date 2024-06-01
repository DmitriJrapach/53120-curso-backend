
document.addEventListener("DOMContentLoaded", () => {
    const forms = document.querySelectorAll('.add-to-cart-form');

    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const productId = form.getAttribute('data-product-id');
            const cartId = form.getAttribute('data-cart-id');

            try {
                const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const messageElement = document.getElementById('message');
                    messageElement.style.display = 'block';
                    setTimeout(() => {
                        messageElement.style.display = 'none';
                    }, 3000);
                } else {
                    console.error('Error al agregar el producto al carrito');
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito', error);
            }
        });
    });
});
