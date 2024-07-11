document.addEventListener('DOMContentLoaded', () => {
  const forms = document.querySelectorAll('.add-to-cart-form');
  forms.forEach(form => {
      form.addEventListener('submit', async (event) => {
          event.preventDefault();

          const productId = form.getAttribute('data-product-id');
          const cartId = form.getAttribute('data-cart-id');

          console.log(`Product ID: ${productId}`); // Log the Product ID
          console.log(`Cart ID: ${cartId}`); // Log the Cart ID

          if (!cartId) {
              console.error('Cart ID not found');
              return;
          }

          try {
              const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              console.log(`Response: ${JSON.stringify(response)}`); // Log the Response
              
              if (response.ok) {
                  document.getElementById('message').style.display = 'block';
                  setTimeout(() => {
                      document.getElementById('message').style.display = 'none';
                  }, 3000);
              } else {
                  throw new Error('Error al agregar el producto al carrito');
              }
          } catch (error) {
              console.error('Error al agregar el producto al carrito', error);
          }
      });
  });
});