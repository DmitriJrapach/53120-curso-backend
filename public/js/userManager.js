document.addEventListener('DOMContentLoaded', () => {
    // Manejar el cambio de rol
    const changeRoleButtons = document.querySelectorAll('.change-role-button');
    changeRoleButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userId = button.getAttribute('data-user-id');
            const currentRole = button.getAttribute('data-current-role');
            const newRole = currentRole === 'user' ? 'premium' : 'user';

            try {
                const response = await fetch(`/api/users/premium/${userId}`, {
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

    // Manejar la eliminación de usuarios
    const deleteButtons = document.querySelectorAll('.delete-user-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (event) => {
            const userId = event.target.getAttribute('data-user-id');
            const confirmed = confirm('¿Estás seguro de que quieres eliminar este usuario?');

            if (confirmed) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        alert('Usuario eliminado exitosamente.');
                        window.location.reload();
                    } else {
                        const result = await response.json();
                        alert(`Error al eliminar el usuario: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Ocurrió un error al eliminar el usuario.');
                }
            }
        });
    });

    // Manejar la eliminación de usuarios inactivos
    const deleteInactiveUsersButton = document.querySelector('#delete-inactive-users');
    if (deleteInactiveUsersButton) {
        deleteInactiveUsersButton.addEventListener('click', async () => {
            const confirmed = confirm('¿Estás seguro de que quieres eliminar todos los usuarios inactivos?');

            if (confirmed) {
                try {
                    const response = await fetch('/api/users/', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    const result = await response.json();

                    if (response.ok) {
                        alert('Usuarios inactivos eliminados exitosamente.');
                        window.location.reload();
                    } else {
                        alert(`Error al eliminar usuarios inactivos: ${result.message}`);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Ocurrió un error al eliminar usuarios inactivos.');
                }
            }
        });
    } else {
        console.warn('Botón "Eliminar Usuarios Inactivos" no encontrado.');
    }
});
