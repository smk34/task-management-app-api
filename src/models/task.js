import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    taskTitle: {
      type: String,
      trim: true,
      maxLength: [20, "Max 20 chars are allowed"],
      require: [true, "Title is required"],
    },
    taskDescription: {
      type: String,
      trim: true,
      maxLength: [250, "Max 250 chars are allowed"],
      require: [true, "Description is required"],
    },
    taskStatus: {
      type: String,
      enum: ["done", "inProgress", "todo"],
      default: "todo",
    },
    assingedToUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isBacklogged: {
      type: Boolean,
      default: false,
    },
    isOnHold: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
