import UserRepository from "./repositories/userRepository.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import jwt from "jsonwebtoken";
import cartModel from "./models/cartModel.js"; // Importar el modelo de carrito

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
            
            return 'Usuario creado correctamente';
        } catch (error) {
            throw new Error(error.message);
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
                const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
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
}

export default UserManager;
