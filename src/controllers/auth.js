import expressAsyncHandler from "express-async-handler";
import {
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../utils/responses.js";
import User from "../models/user.js";
import validateUserLogin from "../middlewares/validateUserLogin.js";
import { createToken } from "../utils/jwt.js";

let AuthController = {};

AuthController.resgisterUser = [
  expressAsyncHandler(async (req, res) => {
    const { email } = req?.body;
    try {
      //Checking for exsiting user with this email
      const existingUser = await User.findOne({ email: email });
      //If yes then restrict the user to resgister with the email
      if (existingUser) {
        return forbiddenResponse(res, {
          data: { existingUser },
          message: "This email is already registered with another user!!",
        });
      }
      //Else allow the user to register
      const creatingUser = new User({ ...req?.body });
      await creatingUser.save();

      // console.log("creaing", creatingUser);
      return successResponse(res, {
        error: false,
        data: { creatingUser },
        message: "User registered succssesfully",
      });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

AuthController.userLogin = [
  validateUserLogin,
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
      User.findOne({ email: email })
        .exec()
        .then(async (logindata) => {
          //Checking for the email in the db
          if (!logindata) {
            return notFoundResponse(res, {
              error: "This email does not exist",
            });
          }
          //Verification for the password
          if (!logindata.authenticate(password)) {
            return unauthorizedResponse(res, {
              error: "Password do not match",
            });
          }
          let user = await User.findOne({ email });
          if (user) {
            //If we found the email then if the user is soft deleted by the admin
            if (user?.isDeleted) {
              return forbiddenResponse(res, {
                message:
                  "Your account has been suspended, please contact your adminstrator",
              });
              //The checking that the user have active account or not
            } else if (!user?.isActive) {
              return forbiddenResponse(res, {
                message:
                  "Your account has been deactivated, please contact your adminstrator",
              });
            }
          }
          const payload = { user_id: user._id, email };
          const authToken = createToken(payload);
          return successResponse(res, {
            error: false,
            data: { user },
            authToken,
            message: "User logged in succssesfully",
          });
        });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

export default AuthController;
