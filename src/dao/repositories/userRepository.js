
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
            return await userModel.create(userData);
        } catch (error) {
            throw new Error("Error al crear el usuario");
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
}

export default UserRepository;
