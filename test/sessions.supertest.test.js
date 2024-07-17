import { expect } from "chai";
import supertest from "supertest";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { startLogger } from "../src/utils/loggerUtil.js";
import path from "path";
import { generateUsers } from "../src/utils/faker.js";

dotenv.config();
const environment = process.env.NODE_ENV || "development";
const envFile = environment === "production" ? "prod.env" : ".env";
dotenv.config({ path: path.resolve(`../${envFile}`) });

const requester = supertest("http://localhost:8080");
const uri = process.env.URI;

const newUser = generateUsers();
newUser.age = 25;
const isUser = { email: "bear@test", password: "test" };

let token;
let newUserId;

before(async function () {
    this.timeout(10000);
    try {
      await mongoose.connect(uri);
      startLogger("DB connection successful");
    } catch (error) {
      startLogger(`Error during setup: ${error.message}`);
      throw error;
    }
});

describe("Testing users routes", () => {
    it("POST Register for Users Endpoint", async () => {
        const response = await requester
            .post("/api/sessions/register")
            .send(newUser)
            .set("Accept", "application/json");

        let finalResponse = response;
        while (finalResponse.statusCode === 302) {
                const location = finalResponse.headers.location;
                finalResponse = await requester.get(location);
        }
        expect(finalResponse.statusCode).to.equal(200);
    });

    it("POST Login Operation for Users Endpoint", async () => {
        const response = await requester
            .post("/api/sessions/login")
            .send({ email: newUser.email, password: newUser.password })
            .set("Accept", "application/json");

        let finalResponse = response;
        while (finalResponse.statusCode === 302) {
            const location = finalResponse.headers.location;
            finalResponse = await requester.get(location);
        }
        expect(finalResponse.statusCode).to.equal(200);
        
        token = response.body.token;
        console.log("Current User Response Body:", response.body);
        newUserId = finalResponse.body._id; // Assuming the response body contains the user ID
    });

    it("GET Current User Endpoint", async () => {
        const response = await requester
            .get("/api/sessions/current")
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json");

        console.log("Current User Response Body:", response.body);

        expect(response.statusCode).to.equal(200);
    });

    it("GET User by UID Endpoint", async () => {
        const response = await requester
            .get(`/api/sessions/${newUserId}`)
            .set("Authorization", `Bearer ${token}`)
            .set("Accept", "application/json");

        expect(response.statusCode).to.equal(200);
    });
});

after(async () => {
    try {
        await mongoose.disconnect();
        startLogger("DB disconnected");
    } catch (error) {
        console.error("Error during DB disconnect:", error);
    }
});
