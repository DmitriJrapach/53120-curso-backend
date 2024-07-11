// public/js/cart.js

document.addEventListener('DOMContentLoaded', () => {
      
    const finalizarCompraButton = document.getElementById('finalizar-compra');
  
    if (finalizarCompraButton) {
      finalizarCompraButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const cartId = event.target.getAttribute('data-cart-id');
        console.log('Finalizando compra para el carrito con ID:', cartId);  // Log para verificar cartId
        
        try {
          const response = await fetch(`/api/carts/${cartId}/purchase`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          console.log('Respuesta del servidor:', response);  // Log para verificar la respuesta
          
          if (response.ok) {
            const result = await response.json();
            console.log('Resultado de la compra:', result);  // Log para verificar el resultado
            alert('Compra realizada con éxito!');
            window.location.reload(); // Recarga la página después de finalizar la compra
          } else {
            const error = await response.json();
            console.error('Error al realizar la compra:', error);  // Log para capturar el error
            alert('Error al realizar la compra: ' + error.message);
          }
        } catch (error) {
          console.error('Error al finalizar la compra:', error);
          alert('Error al finalizar la compra: ' + error.message);
        }
      });
    }
  
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
  });
  