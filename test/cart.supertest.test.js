import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { startLogger } from "../src/utils/loggerUtil.js";
import * as dotenv from "dotenv";
import path from "path";
//mocha src/test/product.supertest.test.js

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const isUser = {
  email: "bear@test",
  password: "test",
};

let cookie;

before(async function () {
    this.timeout(10000);
    try {
      await mongoose.connect(uri);
      startLogger(`DB connection successful`);
  
      // Realizar el login y guardar la cookie
      const loginResponse = await requester
        .post("/api/users/login")
        .send(isUser)
        .set("Accept", "application/json");
  
      let finalResponse = loginResponse;
      while (finalResponse.statusCode === 302) {
          const location = finalResponse.headers.location;
          finalResponse = await requester.get(location);
      }
      expect(finalResponse.statusCode).to.equal(200);
  
      // Guardar la cookie de autenticación
      cookie = finalResponse.headers['set-cookie'][0];
  
    } catch (error) {
      startLogger(`Error during setup: ${error.message}`);
    }
  });

describe("Testing login endpoint", () => {
    it("Login credentials", async () => {
      const response = await requester
        .post("/api/users/login")
        .send(isUser)
        .set("Accept", "application/json");
  
        let finalResponse = response;
        while (finalResponse.statusCode === 302) {
            const location = finalResponse.headers.location;
            finalResponse = await requester.get(location);
        }
        expect(finalResponse.statusCode).to.equal(200);
  
    });
    it("POST /api/carts", () => {
        it("should create a new cart or return the user's cart", async () => {
            const response = await requester.post("/api/carts").set('Authorization', `Bearer ${token}`);
            expect(response.body.status).to.equal('success');
            expect(response.body.message).to.equal('carrito creado');
            expect(response.body.cart).to.be.an('object');
          });
    });
    it("should return a payload of carts", async () => {
        const response = await requester.get("/api/carts/")
          .set('Cookie', cookie);
        expect(response.body.status).to.equal('success');
        expect(response.body.payload).to.be.an('array').that.is.not.empty;
    });
    
});