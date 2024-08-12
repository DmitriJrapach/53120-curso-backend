document.addEventListener('DOMContentLoaded', () => {
  const finalizarCompraButton = document.getElementById('finalizar-compra');

  if (finalizarCompraButton) {
    finalizarCompraButton.addEventListener('click', async (event) => {
      event.preventDefault();
      const cartId = event.target.getAttribute('data-cart-id');

      try {
        const response = await fetch(`/api/carts/${cartId}/purchase`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Verifica el tipo de contenido de la respuesta
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          console.log('Resultado de la compra:', result);

          if (response.ok) {
            alert('Compra realizada con éxito!');
            window.location.href = `/tickets/${result.payload.ticketId}`; // Redirige a la vista del ticket
          } else {
            alert('Error al realizar la compra: ' + result.message);
          }
        } else {
          console.error('Error: La respuesta del servidor no es JSON.');
          const errorText = await response.text();
          alert('Error al realizar la compra: ' + errorText);
        }
      } catch (error) {
        console.error('Error al finalizar la compra:', error);
        alert('Error al finalizar la compra: ' + error.message);
      }
    });
  }
});
document.querySelectorAll('.remove-from-cart-form').forEach(form => {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const productId = event.target.getAttribute('data-product-id');
    const cartId = event.target.getAttribute('data-cart-id');

    try {
      const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        document.getElementById('message').style.display = 'block';
        setTimeout(() => {
          document.getElementById('message').style.display = 'none';
        }, 2000);
        window.location.reload(); // Recarga la página después de eliminar el producto
      } else {
        const error = await response.json();
        alert('Error al eliminar el producto del carrito: ' + error.message);
      }
    } catch (error) {
      console.error('Error al eliminar el producto del carrito:', error);
      alert('Error al eliminar el producto del carrito: ' + error.message);
    }
  });
});
