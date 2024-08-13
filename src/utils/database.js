// src/utils/database.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

class Database {
    constructor() {
        if (!Database.instance) {
            this.uri = process.env.URI;
            this.connect();
            Database.instance = this;
        }
        return Database.instance;
    }

    async connect() {
        try {
            await mongoose.connect(this.uri); // Elimina las opciones obsoletas
            console.log('Conexión exitosa a MongoDB Atlas');
        } catch (error) {
            console.error('Error al conectar a MongoDB:', error);
        }
    }
}

const instance = new Database();
Object.freeze(instance);

export default instance;
