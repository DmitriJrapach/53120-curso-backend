import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { startLogger } from "../src/utils/loggerUtil.js";
import * as dotenv from "dotenv";
import path from "path";
import { generateProduct } from "../src/utils/faker.js";
//mocha src/test/product.supertest.test.js

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const isAdmin = {
  email: "enano@test",
  password: "test",
};

before(async function () {
  this.timeout(10000);
  try {
    await mongoose.connect(uri);
    startLogger(`DB connection successful`);
  } catch (error) {
    startLogger(`Error during setup: ${error.message}`);
  }
});

describe("Testing login endpoint", () => {
  it("Login credentials", async () => {
    const response = await requester
      .post("/api/sessions/login")
      .send(isAdmin)
      .set("Accept", "application/json");

      let finalResponse = response;
      while (finalResponse.statusCode === 302) {
          const location = finalResponse.headers.location;
          finalResponse = await requester.get(location);
      }
      expect(finalResponse.statusCode).to.equal(200);

  });
  it("POST /api/products", () => {
    let product = generateProduct();
  
    it("should add a new product", async () => {
      const response = await requester.post("/api/products").set('Authorization', `Bearer ${token}`).send({product});
      
      expect(response.body.status).to.equal('success');
      expect(response.body.message).to.equal('producto agregado');
      expect(response.body.newProduct).to.be.an('object');
    })
  });

  it("GET /api/products", () => {
    it("should return an array of products", async () => {
      const response = await requester.get("/api/products").set('Authorization', `Bearer ${token}`);
      expect(response.body.status).to.equal('success');
      expect(response.body.products.products).to.be.an('array').that.is.not.empty;
    });
  });
});

  



after(async () => {
  await mongoose.disconnect();
  startLogger("DB disconnected");
});