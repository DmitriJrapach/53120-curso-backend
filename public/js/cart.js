document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.remove-from-cart-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
  
            const productObjectId = form.getAttribute('data-product-id');
            const cartId = form.getAttribute('data-cart-id');
  
            try {
                console.log('Solicitud DELETE enviada a:', `/api/carts/${cartId}/products/${productObjectId}`);
                const response = await fetch(`/api/carts/${cartId}/products/${productObjectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
  
                console.log('Respuesta del servidor:', response);
  
                if (response.ok) {
                    document.getElementById('message').innerText = 'Producto eliminado!';
                    document.getElementById('message').style.display = 'block';
                    setTimeout(() => {
                        document.getElementById('message').style.display = 'none';
                        window.location.reload(); // Recargar la página para actualizar el carrito
                    }, 3000);
                } else {
                    throw new Error('Error al eliminar el producto del carrito');
                }
            } catch (error) {
                console.error('Error al eliminar el producto del carrito', error);
            }
        });
    });
  });
  