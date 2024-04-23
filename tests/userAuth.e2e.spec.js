import bcrypt from "bcrypt";
import request from "supertest";
import { connect } from "../src/database/connection.js";
import app from "../src/index.js";
import dotenv from "dotenv";
import { clearDB } from "./helpers/testFunctions.js";
import { mongo } from "mongoose";

dotenv.config();

const TEST_DB = process.env.TEST_MONGODB_URI;

describe("E2E tests for user", () => {
  let mongodb;
  beforeAll(async () => {
    mongodb = await connect(TEST_DB);
    await clearDB(mongodb);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongodb.connection.close();
  });

  it("should not be able to login", async () => {
    await clearDB();
    const res = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "password",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toEqual("Unauthorized");
  });

  it("should be able to register", async () => {
    await clearDB(mongodb);
    const res = await request(app).post("/register").send({
      email: "test@gmail.com",
      password: "password",
      confirmPassword: "password",
      firstName: "Test",
      lastName: "User",
      username: "testuser123",
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual("User created successfully");
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data).toHaveProperty("firstName");
    expect(res.body.data.lastName).toEqual("User");
    expect(res.body.data).toHaveProperty("email");
    expect(res.body.data.email).toEqual("test@gmail.com");
  });

  it("should be able to login and receive a valid JWT", async () => {
    await clearDB(mongodb);
    mongodb.connection.db.collection("users").insertOne({
      email: "test@gmail.com",
      password: await bcrypt.hash("password", 10),
      username: "testuser123",
      firstName: "Test",
      lastName: "User",
      role: "USER",
    });

    const res = await request(app).post("/login").send({
      email: "test@gmail.com",
      password: "password",
    });

    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Login Successful");
    expect(res.body.data).toHaveProperty("accessToken");
    expect(res.body.data).not.toHaveProperty("password");
  });

  it("should not be able to login - incomplete payload", async () => {
    const res = await request(app).post("/login").send({
      email: "test@yopmail.com",
    });

    console.log(res.body);
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toEqual("Validation error");
    expect(res.body).toHaveProperty("errors");
  });
});