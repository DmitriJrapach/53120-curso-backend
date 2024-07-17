import UserRepository from "./repositories/userRepository.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import jwt from "jsonwebtoken";
import cartModel from "./models/cartModel.js"; // Importar el modelo de carrito
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
            console.log('Nuevo carrito creado:', newCart);

            // Crear el nuevo usuario con el carrito asignado
            const newUser = await this.userRepository.createUser({ 
                first_name, 
                last_name, 
                email, 
                age, 
                password: hashedPassword, 
                cart: newCart._id 
            });
            console.log('Nuevo usuario creado:', newUser);

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
            console.log("Usuario encontrado:", user);
            if (!user) throw new Error('Usuario inválido!');
            if (isValidPassword(user, password)) {
                const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
                console.log("Token generado:", token); 
                user.token = token;
                return user;
                
            } else {
                throw new Error("Contraseña inválida!");
            }
        } catch (error) {
            throw new Error("Error de inicio de sesión!");
        }
    }

    async getUser(uid) {
        try {
            return await this.userRepository.findById(uid);
        } catch (error) {
            throw new Error("Error al obtener el usuario");
        }
    }

    async requestPasswordReset(email) {
        try {
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error('No se encontró un usuario con ese email.');
            }

            // Generar token JWT con duración de 1 hora
            console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log para verificar el valor
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
            console.log('Token decodificado:', decoded);

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
            console.log('Nueva contraseña antes de hashear:', newPassword);
            const hashedPassword = createHash(newPassword);
            console.log('Contraseña hasheada:', hashedPassword);

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

    async getAllUsers() {
        try {
            return await this.userRepository.findAll();
        } catch (error) {
            console.error('Error en UserManager.getAllUsers:', error.message);
            throw new Error('Error al obtener todos los usuarios');
        }
    }
}

export default UserManager;