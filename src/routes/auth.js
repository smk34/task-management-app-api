import express from "express";
import AuthController from "../controllers/auth.js";

const auth = express.Router();

auth.post("/auth/register", AuthController.resgisterUser);
auth.post('/auth/login', AuthController.userLogin);

export default auth;
