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
