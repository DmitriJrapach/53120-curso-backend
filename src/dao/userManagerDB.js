import userModel from "./models/userModel.js";
import { isValidPassword } from "../utils/functionsUtils.js";
import jwt from "jsonwebtoken";

class UserManager {

    async getUsers() {
      try {
        return await userModel.find().lean();
      } catch (error) {
        throw new Error("Error finding Users!");
      }
    }

    async getUser(uid) {
      try {
        return await userModel.findOne({_id: uid}).lean();
      } catch (error) {
        throw new Error("User not found!");
      }
    }

    async addUser(user) {
        const { first_name, last_name, email, age, password } = user;

        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('User could not be created!');
        }

        const emailExists = await userModel.findOne({email}).lean();

        if (emailExists) {
          new Error("User already exists");
        }

        try {
          await userModel.create({ first_name, last_name, email, age, password });

          return "User created succesfully";
        } catch (error) {
          throw new Error('One or more fields are wrong or not in correct format!');
        }
    }

    async loginUser(email, password) {
        if (!email || !password) {
          throw new Error("Invalid credentials!");
        }
        try {
          const user = await userModel.findOne({email}).lean();
          
          if (!user) throw new Error('Invalid user!');

          if (isValidPassword(user, password)) {
            const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });
            return { token, user };
          }else{
            throw new Error("Invalid Password!");
          }
        } catch (error) {
          throw new Error("Login Error!");
        }
    }
}
  
export default UserManager;