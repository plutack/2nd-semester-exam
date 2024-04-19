// import necessary modules
import mongoose from "mongoose";
import { countWords } from "../../helper/textHelpers.js";
import joi from "joi";
// create schema for post
const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      required: true,
    },
    readCount: {
      type: Number,
      required: true,
    },
    readingTime: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// properly format how post details is returned to the user
postSchema.pre("save", function (next) {
  const avgReadingSpeed = 250; // average reading speed in word per minute
  const postWordCount = countWords(this.body);
  this.readingTime = Math.ceil(postWordCount / avgReadingSpeed);
  next();
});
postSchema.pre("findOneAndUpdate", function incrementReadCount(next) {
  if (this._update && this._conditions) {
    this._update.$inc = { readCount: 1 };
  }
  next();
});
// transform with 3 dot operator is used to rearrange as required by specification of returned response
postSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
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
