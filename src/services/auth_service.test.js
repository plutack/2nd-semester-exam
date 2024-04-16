// import necessary modules
import { register } from "../../src/services/auth_service.js";
import User from "../../src/database/schema/user_schema.js";
import bcrypt from "bcrypt";

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset mocks before each test
  });

  it("should register a new user", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "password123";
    const confirmPassword = "password123";
    const role = "user";

    // Mock the User.findOne function to return null, indicating that the user does not exist
    User.findOne = jest.fn().mockResolvedValue(null);

    // Mock the bcrypt.hash function to return the hashed password
    bcrypt.hash = jest.fn().mockResolvedValue("hashedPassword");

    // Mock the User.save function to return the new user
    const saveMock = jest.spyOn(User.prototype, "save").mockResolvedValue({
      _id: "generatedID", // Placeholder for dynamically generated ID
      name,
      email,
      password: "hashedPassword",
      role,
    });

    const newUser = await register(
      name,
      email,
      password,
      confirmPassword,
      role,
    );

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(saveMock).toHaveBeenCalled();
    expect(newUser).toEqual(
      expect.objectContaining({
        name,
        email,
        id: expect.any(String),
      }),
    );
  });

  it("should throw an error if the user already exists", async () => {
    // Mock the User.findOne function to return a user, indicating that the user already exists
    User.findOne = jest.fn().mockResolvedValue({});

    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "password123";
    const confirmPassword = "password123";
    const role = "user";

    await expect(
      register(name, email, password, confirmPassword, role),
    ).rejects.toThrow("user already exists");
  });

  it("should throw an error if the password does not match", async () => {
    const name = "Johna Doe";
    const email = "johnadoe@example.com";
    const password = "password123";
    const confirmPassword = "differentPassword";
    const role = "user";

    await expect(
      register(name, email, password, confirmPassword, role),
    ).rejects.toThrow("Password does not match");
  });
});
