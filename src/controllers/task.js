import expressAsyncHandler from "express-async-handler";
import Task from "../models/task.js";
import { verifyToken } from "../middlewares/verifyUser.js";
import validateTaskCreate from "../middlewares/validateTaskCreate.js";
import mongoose from "mongoose";
import {
  badRequestResponse,
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
} from "../utils/responses.js";

let TaskController = {};

TaskController.createTask = [
  // verifyToken,
  // validateTaskCreate,
  expressAsyncHandler(async (req, res) => {
    try {
      const newTask = new Task({ ...req.body });
      await newTask.save();
      return successResponse(res, {
        error: false,
        data: { newTask },
        message: "Task created succssesfully",
      });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

// TaskController.getTask = [
//   expressAsyncHandler(async (req, res) => {
//     const { id } = req?.params;
//     const { taskStatus } = req?.query;
//     try {
//       let query = {};
//       //To get one task by task id
//       if (id) {
//         //If task id is given then checking the it is valid id or not
//         if (!mongoose.Types.ObjectId.isValid(id)) {
//           return badRequestResponse(res, {
//             message: "Please send a valid task id",
//           });
//         }
//         //if valid then  find the task
//         query = { _id: id };
//       }
//       //To get tasks by task status
//       if (taskStatus) {
//         query = { taskStatus: taskStatus };
//       }
//       //If neither id nor taskStatus is given, return all tasks
//       if (!id && !taskStatus) {
//         query = {};
//       }
//       //Find tasks based on the query
//       const tasks = await Task.find(query);
//       //If no tasks are found
//       if (!tasks || tasks.length === 0) {
//         return notFoundResponse(res, {
//           message: "No tasks found",
//         });
//       }
//       return successResponse(res, {
//         error: false,
//         data: { tasks },
//         message: "Data fetched successfully",
//       });
//     } catch (error) {
//       console.log(error);
//       return serverErrorResponse(res, error);
//     }
//   }),
// ];

TaskController.getTask = [
  expressAsyncHandler(async (req, res) => {
    const { id } = req?.params;
    const { taskStatus, taskName } = req?.query;
    try {
      let query = {};
      //To get one task by task id
      if (id) {
        //If task id is given then checking the it is valid id or not
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return badRequestResponse(res, {
            message: "Please send a valid task id",
          });
        }
        //if valid then  find the task
        query = { _id: id };
      }
      //To get tasks by task status
      if (taskStatus) {
        query = { taskStatus: taskStatus };
      }
      //To get tasks by task name
      if (taskName) {
        query = { taskName: { $regex: taskName, $options: "i" } };
      }
      //If neither id nor taskStatus nor taskName is given, return all tasks
      if (!id && !taskStatus && !taskName) {
        query = {};
      }
      //Find tasks based on the query
      const tasks = await Task.find(query);
      //If no tasks are found
      if (!tasks || tasks.length === 0) {
        return notFoundResponse(res, {
          message: "No tasks found",
        });
      }
      return successResponse(res, {
        error: false,
        data: { tasks },
        message: "Data fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

TaskController.deleteTask = [
  expressAsyncHandler(async (req, res) => {
    const { id } = req?.params;
    try {
      if (!id || mongoose.Types.ObjectId.isValid(id)) {
        forbiddenResponse(res, {
          message: "Please send a valid id",
        });
      }
      await Task.findByIdAndDelete({ _id: id });
      return successResponse(res, {
        error: false,
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

export default TaskController;
