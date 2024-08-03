
// src/dao/repositories/userRepository.js
import userModel from "../models/userModel.js";

class UserRepository {
    async findById(id) {
        try {
            return await userModel.findById(id);
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
            const result = await userModel.findByIdAndDelete(id).lean();
            return result;
        } catch (error) {
            console.error('Repositorio: Error al eliminar el usuario:', error);
            throw new Error('Error al eliminar el usuario');
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
    async findInactiveUsers(twoDaysAgo) {
        try {
            console.log('Buscando usuarios inactivos con fecha límite:', twoDaysAgo);
            const users = await userModel.find({ last_connection: { $lte: twoDaysAgo } });
            console.log('Usuarios inactivos encontrados:', users);
            return users;
        } catch (error) {
            throw new Error("Error al buscar usuarios inactivos");
        }
    }

    async deleteManyInactiveUsers(twoDaysAgo) {
        try {
            const result = await userModel.deleteMany({ last_connection: { $lte: twoDaysAgo } });
            console.log('Resultado de la eliminación:', result);
            return result;
        } catch (error) {
            throw new Error("Error al eliminar usuarios inactivos");
        }
    }

}

export default UserRepository;