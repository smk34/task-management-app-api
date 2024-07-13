import mongoose, { Schema } from "mongoose";
import { uuid } from "uuidv4";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      trim: true,
      require: [true, "User name is required"],
    },
    email: {
      type: String,
      trim: true,
      require: [true, "User email is required"],
      lowercase: true
    },
    encryPassword: {
      type: String,
    },
    salt: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


//Password Encryption
userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuid();
    this.encryPassword = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  authenticate: function (plainpassword) {
    return this.securePassword(plainpassword) === this.encryPassword;
  },

  securePassword: function (plainpassword) {
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
};

const User = mongoose.model("User", userSchema);
export default User;