// public/js/userManager.js

document.addEventListener('DOMContentLoaded', () => {
    const changeRoleButtons = document.querySelectorAll('.change-role-button');

    changeRoleButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-user-id');
            const currentRole = button.getAttribute('data-current-role');
            const newRole = currentRole === 'user' ? 'premium' : 'user';

            try {
                const response = await fetch(`/api/sessions/premium/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`El rol del usuario se ha cambiado a ${newRole}`);
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    alert(`Error al cambiar el rol del usuario: ${result.message}`);
                }
            } catch (error) {
                console.error('Error al cambiar el rol del usuario:', error);
                alert('Ocurrió un error al intentar cambiar el rol del usuario.');
            }
        });
    });
});
