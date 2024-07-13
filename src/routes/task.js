import express from "express";
import TaskController from "../controllers/task.js";

const task = express.Router()

task.post('/task/create', TaskController.createTask)
task.get('/task/gettask/:id?', TaskController.getTask)
task.delete('/task/deletetask/:id', TaskController.deleteTask)

export default task;