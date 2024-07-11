
// src/dao/repositories/userRepository.js
import userModel from "../models/userModel.js";

class UserRepository {
    async findById(id) {
        try {
            return await userModel.findById(id).lean();
        } catch (error) {
            throw new Error("Error al buscar el usuario por ID");
        }
    }

    async findByEmail(email) {
        try {
            return await userModel.findOne({ email }).lean();
        } catch (error) {
            throw new Error("Error al buscar el usuario por email");
        }
    }

    async createUser(userData) {
        try {
            // Eliminar githubId si está presente en los datos del usuario
            if ('githubId' in userData) {
                delete userData.githubId;
            }
            // console.log('Datos recibidos en UserRepository.createUser:', userData);
            const newUser = await userModel.create(userData);
            // console.log('Usuario creado en UserRepository.createUser:', newUser);
            return newUser;
        } catch (error) {
            console.error('Error en UserRepository.createUser:', error.message);
            console.error('Stack trace:', error.stack);
            throw new Error('Error al crear el usuario');
        }
    }

    async updateUser(id, updateData) {
        try {
            return await userModel.findByIdAndUpdate(id, updateData, { new: true }).lean();
        } catch (error) {
            throw new Error("Error al actualizar el usuario");
        }
    }

    async deleteUser(id) {
        try {
            return await userModel.findByIdAndDelete(id).lean();
        } catch (error) {
            throw new Error("Error al eliminar el usuario");
        }
    }

     // Implementar la función updateUserPassword
     async updateUserPassword(userId, hashedPassword) {
        try {
            // Actualizar solo el campo de contraseña
            return await userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true }).lean();
        } catch (error) {
            console.error('Error en UserRepository.updateUserPassword:', error.message);
            throw new Error('Error al actualizar la contraseña del usuario');
        }
    }

    async findAll() {
        try {
            return await userModel.find({}).lean();
        } catch (error) {
            throw new Error('Error al obtener todos los usuarios');
        }
    }

}

export default UserRepository;