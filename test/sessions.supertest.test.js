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
            .send({ email: "enano@test", password: "test" })
            .set("Accept", "application/json");

            let finalResponse = response;
            while (finalResponse.statusCode === 302) {
                const location = finalResponse.headers.location;
                finalResponse = await requester.get(location);
            }
            expect(finalResponse.statusCode).to.equal(200);
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
