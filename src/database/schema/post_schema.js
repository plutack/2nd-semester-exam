// import necessary modules
import mongoose from "mongoose";

// create schema for post
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// properly format how post details is returned to the user
// transform with 3 dot operator is used to rearrange as required by specification of returned response
postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return {
      id: ret.id,
      ...ret,
    };
  },
});

// initailize model from defined schema
const Post = mongoose.model("Post", postSchema);

export default Post;
