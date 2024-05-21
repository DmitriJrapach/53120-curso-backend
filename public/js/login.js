
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();
        if (result.status === 'success') {
            // Redirigir al usuario a la página de productos
            window.location.href = '/products';
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});