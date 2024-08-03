// src/controllers/userController.js
import userService from '../services/userService.js';
import { userDTO } from '../dto/userDTO.js';
import UsersDTO from '../dto/usersDTO.js';

const githubAuth = (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
};

const githubCallback = (req, res) => {
    console.log("Datos recibidos de GitHub:", req.user);
    req.session.user = req.user;
     // Enviar el email y la contraseña provisoria como parte de la cadena de consulta
     const email = encodeURIComponent(req.user.email);
     const password = encodeURIComponent("12345");
     res.redirect(`/login?email=${email}&password=${password}`);
};

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const result = await userService.addUser({ first_name, last_name, email, age, password });
        req.logger.info(`Usuario registrado: ${email}`);
        res.redirect('/login');
    } catch (error) {
        req.logger.warning('Error en el controlador al registrar usuario:', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.loginUser(email, password);
        
        res.cookie('auth', user.token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        req.session.user = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cartId: user.cart._id.toString()
        };

        req.logger.info(`Usuario logueado: ${email}`);
        res.redirect('/products');
    } catch (error) {
        req.logger.warning('Error en el controlador al loguearse:', error);
        res.redirect('/login');
    }
};

const current = (req, res) => {
    const user = userDTO(req.user);
    res.send({
        user
    });
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const result = await userService.getUser(uid);
        res.send({
            status: 'success',
            payload: result
        });
    } catch (error) {
        req.logger.warning('Error en el controlador al obtener al usuario', error);
        res.status(400).send({
            status: 'error',
            message: error.message
        });
    }
};
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        const usersDTOs = users.map(user => new UsersDTO(user));
        res.render('allUsers', { 
            title: 'Users',
            style: 'index.css',
            users: usersDTOs
            });
    } catch (error) {
        req.logger.warning('Error al obtener la lista de usuarios', error);
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener la lista de usuarios'
        });
    }
};
const adminGetAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.render('userManager', { 
            title: 'User Manager',
            style: 'index.css',
             users
            });
    } catch (error) {
        req.logger.warning('Error al obtener la lista de usuarios', error);
        res.status(500).send({
            status: 'error',
            message: 'Error al obtener la lista de usuarios'
        });
    }
};

const logout = async (req, res) => {
    const userEmail = req.session?.user?.email;
    try {
        if (userEmail) {
            const user = await userService.getUserByEmail(userEmail);
            if (user) {
                await userService.updateLastConnection(user._id); // Actualizar la última conexión en el logout
                req.logger.info(`Usuario deslogueado: ${userEmail}`);
            }
        }
        req.session.destroy(error => {
            if (error) {
                req.logger.warning('Error al destruir la sesión:', error);
                return res.status(500).send({ status: 'error', message: 'Error al cerrar sesión' });
            }
            res.redirect("/login");
        });
    } catch (error) {
        req.logger.warning('Error en el controlador al cerrar sesión:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
};

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const response = await userService.requestPasswordReset(email);
        req.logger.info(`Solicitud de restablecimiento de contraseña para: ${email}`);
        res.send(response.message);
    } catch (error) {
        req.logger.warning(`Error en solicitud de restablecimiento de contraseña para: ${email}`, error);
        res.status(400).send(error.message);
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const response = await userService.resetPassword(token, newPassword);
        req.logger.info(`Contraseña restablecida con token: ${token}`);
        res.send(response.message);
    } catch (error) {
        req.logger.warning('Error en userController.resetPassword:', error.message);
        res.status(400).send(error.message);
    }
};
const uploadDocuments = async (req, res) => {
    const { uid } = req.params;

    try {
        if (req.files) {
            const uploadedDocs = {
                idDocument: req.files.idDocument ? req.files.idDocument[0].filename : null,
                addressDocument: req.files.addressDocument ? req.files.addressDocument[0].filename : null,
                statementDocument: req.files.statementDocument ? req.files.statementDocument[0].filename : null
            };

            const profileImage = req.files.profileImage ? req.files.profileImage[0].filename : null;
            const productImage = req.files.productImage ? req.files.productImage[0].filename : null;

            const documents = [
                uploadedDocs.idDocument && { name: 'idDocument', reference: `/public/img/documents/${uploadedDocs.idDocument}` },
                uploadedDocs.addressDocument && { name: 'addressDocument', reference: `/public/img/documents/${uploadedDocs.addressDocument}` },
                uploadedDocs.statementDocument && { name: 'statementDocument', reference: `/public/img/documents/${uploadedDocs.statementDocument}` }
            ].filter(doc => doc); // Filtra los documentos que son null o undefined

            await userService.updateUserDocuments(uid, documents);

            return res.status(200).json({ message: 'Documents uploaded successfully.', uploadedDocs, profileImage, productImage });
        } else {
            return res.status(400).json({ error: 'Bad Request', message: 'No documents were uploaded.' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
};

const changeUserRole = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await userService.getUser(uid);

        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }

        if (user.role === 'user') {
            const requiredDocuments = ['idDocument', 'addressDocument', 'statementDocument'];
            const uploadedDocuments = user.documents.map(doc => doc.name);

            const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc));

            if (!hasAllDocuments) {
                return res.status(400).send({ status: 'error', message: 'Faltan documentos necesarios para cambiar a premium' });
            }

            user.role = 'premium';
        } else if (user.role === 'premium') {
            user.role = 'user';
        }

        await userService.updateUserRole(user._id, user.role);
        req.logger.info(`Rol del usuario cambiado: ${user.email} a ${user.role}`);

        return res.send({ status: 'success', message: `Rol cambiado a ${user.role}` });
    } catch (error) {
        req.logger.warning('Error al cambiar el rol del usuario:', error);
        return res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
};
const deleteUser = async (req, res) => {
    const { uid } = req.params;

    try {
        const user = await userService.deleteUser(uid);
        if (!user) {
            return res.status(404).send({ status: 'error', message: 'Usuario no encontrado' });
        }
        res.send({ status: 'success', message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        console.error('Controlador: Error al eliminar el usuario:', error);
        req.logger.warning('Error al eliminar el usuario:', error);
        res.status(500).send({ status: 'error', message: 'Error interno del servidor' });
    }
};
const deleteInactiveUsers = async (req, res) => {
    console.log('Controlador: Intentando eliminar usuarios inactivos');
    try {
        const result = await userService.deleteInactiveUsers();
        console.log('Controlador: Usuarios inactivos eliminados', result);
        res.status(200).json(result);
    } catch (error) {
        console.error('Controlador: Error al eliminar usuarios inactivos:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export default {
    githubAuth,
    githubCallback,
    register,
    login,
    current,
    getUser,
    getAllUsers,
    adminGetAllUsers,
    logout,
    requestPasswordReset,
    resetPassword,
    changeUserRole,
    uploadDocuments,
    deleteUser,
    deleteInactiveUsers
};
