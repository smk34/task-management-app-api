import jwt from "jsonwebtoken";
import { unauthorizedResponse } from "../utils/responses.js";

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =
    req?.body?.token || req?.query?.token || req?.headers["authorization"];
  const authToken = token.split(" ");
  if (!token || authToken.length !== 2 || authToken[0] !== "Bearer") {
    return res.status(401).json({ error: "Invalid auth token" });
  }
  const authKey = authToken[1];
  if (!authKey) {
    return res.status(401).json({ error: "Auth token is blank" });
  }
  if (!authKey) {
    return unauthorizedResponse(res, {
      message: "A token is required for authentication",
    });
  }
  try {
    const decoded = jwt.verify(authKey, config.JWT_SECRET);
    req.user = decoded;
  } catch (error) {
    return unauthorizedResponse(res, { message: "Invalid token" });
  }
  return next();
};

export { verifyToken };
