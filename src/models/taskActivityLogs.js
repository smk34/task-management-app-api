import mongoose, { Schema } from "mongoose";

const taskActivityLogsSchema = new Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
    assingedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assingedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const TaskActivityLogs = mongoose.model(
  "TaskActivityLogs",
  taskActivityLogsSchema
);
export default TaskActivityLogs;
