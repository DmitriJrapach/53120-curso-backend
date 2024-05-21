import userModel from "./models/userModel.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";
import jwt from "jsonwebtoken";

class UserManager {
    async addUser({ first_name, last_name, email, age, password }) {
        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('Todos los campos de usuario son obligatorios!');
        }
        const hashedPassword = createHash(password);
        try {
            const existingUser = await userModel.findOne({ email }).lean();
            if (existingUser) {
                throw new Error('El usuario ya existe');
            }
            await userModel.create({ first_name, last_name, email, age, password: hashedPassword });
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
            const user = await userModel.findOne({ email }).lean();
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

    
}

export default UserManager;
