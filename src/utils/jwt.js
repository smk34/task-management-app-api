import jwt from "jsonwebtoken";

const createToken = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    algorithm: "HS256",
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return token;
};

export { createToken };
