import userModel from "./models/userModel.js";
import { isValidPassword, createHash } from "../utils/functionsUtils.js";

import jwt from "jsonwebtoken";

class UserManager {

    async getUsers() {
      try {
        return await userModel.find().lean();
      } catch (error) {
        throw new Error("Error finding Users!");
      }
    }

    // async getUser(uid) {
    //   try {
    //     return await userModel.findOne({_id: uid}).lean();
    //   } catch (error) {
    //     throw new Error("User not found!");
    //   }
    // }

    async getUser(uid) {
      try {
          return await userModel.findById(uid).lean();
      } catch (error) {
          throw new Error("User not found!");
      }
  }

    async addUser({ first_name, last_name, email, age, password }) {
      if (!first_name || !last_name || !email || !age || !password) {
          throw new Error('All user fields are required!');
      }
      const hashedPassword = createHash(password);
      try {
          const existingUser = await userModel.findOne({ email }).lean();
          if (existingUser) {
              throw new Error('User already exists');
          }
          await userModel.create({ first_name, last_name, email, age, password: hashedPassword });
          return 'User created successfully';
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async loginUser(email, password) {
    if (!email || !password) {
        throw new Error("Invalid credentials!");
    }
    try {
        const user = await userModel.findOne({ email }).lean();
        if (!user) throw new Error('Invalid user!');
        if (isValidPassword(user, password)) {
            const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
            user.token = token; // Asignar el token al objeto de usuario
            return user;
        } else {
            throw new Error("Invalid Password!");
        }
    } catch (error) {
        throw new Error("Login Error!");
    }
}
}
  
export default UserManager;