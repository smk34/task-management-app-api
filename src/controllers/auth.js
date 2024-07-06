import expressAsyncHandler from "express-async-handler";
import {
  forbiddenResponse,
  notFoundResponse,
  serverErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "../utils/responses";
import User from "../models/user";
import validateUserLogin from "../middlewares/validateUserLogin";
import { createToken } from "../utils/jwt";

let AuthController = {};

AuthController.resgisterUser = [
  expressAsyncHandler(async (req, res) => {
    const { email } = req?.body;
    try {
      //Checking for exsiting user with this email
      const existingUser = User.findOne({ email: email });
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
      return successResponse(res, {
        error: false,
        data: { creatingUser },
        message: "User registered succssesfully!!",
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
          // console.log("login<><><>",logindata);
          if (!logindata) {
            return notFoundResponse(res, {
              error: "This email does not exist",
            });
          }
          if (!logindata.authenticate(password)) {
            return unauthorizedResponse(res, {
              error: "Password do not match",
            });
          }
          let user = await User.findOne({ email });
          if (user) {
            if (user?.isDeleted) {
              return forbiddenResponse(res, {
                message:
                  "Your account has been suspended, please contact your adminstrator!!",
              });
            } else if (!user?.isActive) {
              return forbiddenResponse(res, {
                message:
                  "Your account has been deactivated, please contact your adminstrator!!",
              });
            }
          }
          const payload = { user_id: user._id, email };
          const authToken = createToken(payload);
          return successResponse(res, {
            error: false,
            data: { user },
            authToken,
          });
        });
    } catch (error) {
      console.log(error);
      return serverErrorResponse(res, error);
    }
  }),
];

export default AuthController;
