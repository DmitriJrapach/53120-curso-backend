import UserRepository from "./repositories/userRepository.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import jwt from "jsonwebtoken";
import cartModel from "./models/cartModel.js";
import sendMail from "../utils/sendMail.js";
import * as dotenv from "dotenv";
dotenv.config();

const secretKey = process.env.JWT_SECRET;

class UserManager {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async addUser({ first_name, last_name, email, age, password }) {
        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('Todos los campos de usuario son obligatorios!');
        }
        const hashedPassword = createHash(password);
        try {
            const existingUser = await this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }
            // Crear un carrito para el nuevo usuario
            const newCart = await cartModel.create({});

            // Crear el nuevo usuario con el carrito asignado
            const newUser = await this.userRepository.createUser({ 
                first_name, 
                last_name, 
                email, 
                age, 
                password: hashedPassword, 
                cart: newCart._id 
            });
            return newUser;
        } catch (error) {
            console.error('Error en UserManager.addUser:', error.message);
            console.error('Stack trace:', error.stack);
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    }

    async loginUser(email, password) {
        if (!email || !password) {
            throw new Error("Credenciales inválidas!");
        }
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) throw new Error('Usuario inválido!');
            if (isValidPassword(user, password)) {
                const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
                // console.log("Token generado:", token); 
                user.token = token;
                return user;
                
            } else {
                throw new Error("Contraseña inválida!");
            }
        } catch (error) {
            throw new Error("Error de inicio de sesión!");
        }
    }
    async updateLastConnection(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            if (!user) throw new Error('Usuario no encontrado');
            user.last_connection = new Date();
            await user.save();
            return user;
        } catch (error) {
            throw new Error('Error al actualizar la última conexión: ' + error.message);
        }
    }
    async getUserByEmail(email) {
        try {
            return await this.userRepository.findByEmail(email);
        } catch (error) {
            throw new Error('Error al obtener el usuario por email');
        }
    }
    async getUser(uid) {
        try {
            return await this.userRepository.findById(uid);
        } catch (error) {
            throw new Error("Error al obtener el usuario");
        }
    }
    async getAllUsers() {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            console.error('Error en UserManager.getAllUsers:', error.message);
            throw new Error('Error al obtener todos los usuarios');
        }
    }

    async requestPasswordReset(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('No se encontró un usuario con ese email.');
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Enviar el correo con el token
            const resetLink = `http://localhost:8080/reset-password/${token}`;
            await sendMail(user.email, 'Recuperación de contraseña', `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`);

            return { message: 'Se ha enviado un enlace de recuperación a tu correo electrónico.' };
        } catch (error) {
            console.error('Error en UserManager.requestPasswordReset:', error.message);
            throw new Error('Error al solicitar la recuperación de la contraseña.');
        }
    }

    async resetPassword(token, newPassword) {
        try {
            // Decodificar el token para obtener el userId
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener los datos actuales del usuario
            const user = await this.userRepository.findById(decoded.userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            // Comparar la nueva contraseña con la actual
            const isSamePassword = isValidPassword(user, newPassword);
            if (isSamePassword) {
                throw new Error('La nueva contraseña no puede ser igual a la actual');
            }

            // Hashear la nueva contraseña
            const hashedPassword = createHash(newPassword);
            
            // Actualizar la contraseña en la base de datos
            await this.userRepository.updateUserPassword(decoded.userId, hashedPassword);

            return { message: 'Contraseña actualizada con éxito.' };
        } catch (error) {
            console.error('Error en UserManager.resetPassword:', error.message);
            throw new Error('Error al restablecer la contraseña. El token es inválido o ha expirado.');
        }
    }
    
    async updateUserRole(userId, newRole) {
        try {
            return await this.userRepository.updateUser(userId, { role: newRole });
        } catch (error) {
            console.error('Error en UserManager.updateUserRole:', error.message);
            throw new Error('Error al actualizar el rol del usuario');
        }
    }

    async updateUserDocuments(userId, documents) {
        try {
            return await this.userRepository.updateUser(userId, { documents });
        } catch (error) {
            console.error('Error en UserManager.updateUserDocuments:', error.message);
            throw new Error('Error al actualizar los documentos del usuario');
        }
    }
    async deleteUser(id) {    
        try {
            const result = await this.userRepository.deleteUser(id);
            return result;
        } catch (error) {
            console.error('Manager: Error al eliminar el usuario:', error);
            throw new Error('Error al eliminar el usuario');
        }
    }
    async deleteInactiveUsers() {
        console.log('Gestor: Iniciando eliminación de usuarios inactivos');
        try {
            // Obtener la fecha y hora actual
            const now = new Date();
 
            // Calcular la fecha límite para usuarios inactivos (2 días antes de ahora)
            const twoDaysAgo = new Date(now.getTime() - 10 * 60 * 1000); // 2 días en milisegundos
            console.log('Fecha límite para inactivos:', twoDaysAgo);

            // Buscar usuarios inactivos
            const inactiveUsers = await this.userRepository.findInactiveUsers(twoDaysAgo);
            console.log('Gestor: Usuarios inactivos encontrados', inactiveUsers.length);
 
            // Eliminar usuarios inactivos
            const result = await this.userRepository.deleteManyInactiveUsers(twoDaysAgo);
            console.log('Gestor: Usuarios eliminados', result.deletedCount);
 
            // Enviar correos electrónicos a los usuarios eliminados
            for (const user of inactiveUsers) {
                const mailOptions = {
                    from: 'Dmitri@example.com',
                    to: user.email,
                    subject: 'Cuenta Eliminada por Inactividad',
                    html: `Tu cuenta ha sido eliminada debido a inactividad.`
                };
        
                await new Promise((resolve, reject) => {
                    transport.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.error('Error al enviar correo electrónico:', error);
                            return reject(error);
                        }
                        resolve(info);
                    });
                });
            }
 
            return {
                status: 'success',
                deletedCount: result.deletedCount
            };
        } catch (error) {
            console.error('Gestor: Error al eliminar usuarios inactivos:', error);
            throw new Error('Error al eliminar usuarios inactivos: ' + error.message);
        }
    }
    
}

export default UserManager;