// import necessary modules
import mongoose from "mongoose";

// define user schema
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.pre("save", function (next) {
  // capitalize
  this.firstName =
    this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
  this.lastName =
    this.lastName.charAt(0).toUpperCase() + this.lastName.slice(1);
  next();
});

// properly format how user details is returned to the user
// transform with 3 dot operator is used to rearrange as required by specification of returned response
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret.password;
    delete ret._id;
    delete ret.role;
    return {
      id: ret.id,
      ...ret,
    };
  },
});

// initialize model from schema
const User = mongoose.model("User", userSchema);

export default User;
