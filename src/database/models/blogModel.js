// import necessary modules
import mongoose from "mongoose";
import { countWords } from "../../helper/textHelpers.js";

// create schema for post
const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",  
    },
    tags: {
      type: [String],
      default: [],
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
      default: 0,
    },
    readingTime: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);

// properly format how post details is returned to the user
blogSchema.pre("save", function (next) {
  const avgReadingSpeed = 250; // average reading speed in word per minute
  const postWordCount = countWords(this.body);
  this.readingTime = Math.ceil(postWordCount / avgReadingSpeed);
  next();
});




// transform returned response with 3 dot operator is used to rearrange as required by specification of returned response
blogSchema.set("toJSON", {
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

// initialize model from defined schema
const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
