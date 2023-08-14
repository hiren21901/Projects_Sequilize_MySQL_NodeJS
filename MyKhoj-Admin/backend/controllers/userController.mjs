import { UserMst } from "../models/userModel.mjs";
// import { FormValidation } from "../utils/formValidation.mjs";
import { body, validationResult } from "express-validator";
import { generateToken } from "../middlewares/jwtAuthMiddleware.mjs";

const loginController = {

  userAuth: async (req, res) => {
    try {
      await Promise.all([
        body("credentials")
          .notEmpty()
          .withMessage("UserName Is Required")
          .run(req),
        body("password")
          .notEmpty()
          .withMessage("Password Is Required")
          .run(req),
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
      }

      const user = await UserMst.userAuth(req.body.credentials, req.body.password);
      if (user.success) {
        const payload = {
          userID: user.success.UserID,
          userName: user.success.UserName,
          departmentID: user.success.DepartmentID,
          designationID: user.success.DesignationID,
        };
        const token = generateToken(payload);
        return res.json({ success: [user.success, token] });
      } else {
        return res.status(400).json({ error: [user.error] });
      }
    } catch (error) {
      return res.status(500).json({
        error: "An error occurred during authentication.",
        status: "error",
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      await Promise.all([
        body("credentials")
          .notEmpty()
          .withMessage("UserName Is Required")
          .run(req),
      ]);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
      }
      const user = await UserMst.getUserByCredentials(req.body.credentials);
      if (user.success) {
        const OTP = generateOTP();
        return res.json({ success: [user.success, OTP] });
      } else {
        return res.status(400).json({ error: [user.error] });
      }
    } catch (error) {
      return res.status(500).json({
        error: "An error occurred during authentication.",
        status: "error",
      });
    }
  },

  updatePassword: async (req, res) => {
    try {
      await Promise.all([
        body("credentials")
          .notEmpty()
          .withMessage("UserName Is Required")
          .run(req),
        body("password")
          .notEmpty()
          .withMessage("Password should not be blank")
          .if(body("password").notEmpty())
          .isLength({ min: 8, max: 15 })
          .withMessage("Password should be between 8 to 15 characters")
          .matches(/[A-Z]/)
          .withMessage("Password should have at least one uppercase letter")
          .matches(/[a-z]/)
          .withMessage("Password should have at least one lowercase letter")
          .matches(/[@$!%*?&]/)
          .withMessage("Password should have at least one special character")
          .matches(/\d/)
          .withMessage("Password should have at least one number")
          .custom((value) => {
            const charArray = value.split("");
            for (let i = 0; i < charArray.length - 2; i++) {
              if (
                charArray[i].charCodeAt(0) ===
                charArray[i + 1].charCodeAt(0) - 1 &&
                charArray[i].charCodeAt(0) ===
                charArray[i + 2].charCodeAt(0) - 2
              ) {
                throw new Error(
                  "Sequential Characters Not Allowed In Password"
                );
              }
            }
            return true;
          })
          .custom((value) => {
            const charArray = value.split("");
            for (let i = 0; i < charArray.length - 2; i++) {
              if (
                charArray[i] === charArray[i + 1] &&
                charArray[i] === charArray[i + 2]
              ) {
                throw new Error("Repeated Characters Not Allowed In Password");
              }
            }
            return true;
          })
          .run(req),
      ]);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
      }
      const updatePass = await UserMst.updatePassword(req.body.credentials, req.body.password);
      if (updatePass.success) {
        return res.json({ success: [updatePass.success] });
      } else {
        return res.status(400).json({ error: [updatePass.error] });
      }
    } catch (error) {
      return res.status(500).json({
        error: "An error occurred during authentication.",
        status: "error",
      });
    }
  },

  userAdd: async (req, res) => {
    try {
      const isUsernameUnique = async (username) => {
        const isUnique = await UserMst.isUnique(username);
        if (!isUnique) {
          throw new Error("Username already exists");
        }
      };

      await Promise.all([
        body("username")
          .notEmpty()
          .withMessage("UserName is required")
          .if(body("username").notEmpty())
          .isLength({ min: 3 })
          .withMessage("UserName should be minimum 3 characters")
          .custom(isUsernameUnique)
          .run(req),

        body("roll").notEmpty().withMessage("Roll is required").run(req),
        body("fname").notEmpty().withMessage("FName is required").run(req),
        body("lname").notEmpty().withMessage("LName is required").run(req),
        body("gender").notEmpty().withMessage("Gender is required").run(req),

        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .if(body("email").notEmpty())
          .isEmail()
          .withMessage("Invalid Email ID")
          .run(req),

        body("mobilenumber")
          .notEmpty()
          .withMessage("Mobile Number is required")
          .if(body("mobilenumber").notEmpty())
          .isNumeric()
          .withMessage("Mobile Number must be numeric")
          .isLength({ min: 10, max: 10 })
          .withMessage("Mobile Number must be 10 digits")
          .if(body("mobilenumber").isLength({ min: 10, max: 10 }))
          .matches(/^[6-9]\d{9}$/)
          .withMessage("Invalid Mobile Number")
          .run(req),

        body("address").notEmpty().withMessage("Address is required").run(req),
        body("departmentid")
          .notEmpty()
          .withMessage("Select Department From Dropdown")
          .run(req),
        body("designationid")
          .notEmpty()
          .withMessage("Select Designation From Dropdown")
          .run(req),
        body("cityid")
          .notEmpty()
          .withMessage("Select City From Dropdown")
          .run(req),

        // body("password")
        //   .notEmpty()
        //   .withMessage("Password should not be blank")
        //   .if(body("password").notEmpty())
        //   .isLength({ min: 8, max: 15 })
        //   .withMessage("Password should be between 8 to 15 characters")
        //   .matches(/[A-Z]/)
        //   .withMessage("Password should have at least one uppercase letter")
        //   .matches(/[a-z]/)
        //   .withMessage("Password should have at least one lowercase letter")
        //   .matches(/[@$!%*?&]/)
        //   .withMessage("Password should have at least one special character")
        //   .matches(/\d/)
        //   .withMessage("Password should have at least one number")
        //   .custom((value) => {
        //     const charArray = value.split("");
        //     for (let i = 0; i < charArray.length - 2; i++) {
        //       if (
        //         charArray[i].charCodeAt(0) ===
        //           charArray[i + 1].charCodeAt(0) - 1 &&
        //         charArray[i].charCodeAt(0) ===
        //           charArray[i + 2].charCodeAt(0) - 2
        //       ) {
        //         throw new Error(
        //           "Sequential Characters Not Allowed In Password"
        //         );
        //       }
        //     }
        //     return true;
        //   })
        //   .custom((value) => {
        //     const charArray = value.split("");
        //     for (let i = 0; i < charArray.length - 2; i++) {
        //       if (
        //         charArray[i] === charArray[i + 1] &&
        //         charArray[i] === charArray[i + 2]
        //       ) {
        //         throw new Error("Repeated Characters Not Allowed In Password");
        //       }
        //     }
        //     return true;
        //   })
        //   .run(req),

      ]);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
      }
      const userDetails = {
        UserName: req.body.username,
        Password: '123',
        DepartmentID: req.body.departmentid,
        DesignationID: req.body.designationid,
        Roll: req.body.roll,
        FName: req.body.fname,
        LName: req.body.lname,
        Gender: req.body.gender,
        Email: req.body.email,
        MobileNumber: req.body.mobilenumber,
        Address: req.body.address,
        CityID: req.body.cityid,
        CreatedBy: req.user.userID,
      };
      const userData = await UserMst.userAdd(userDetails);
      if (userData.success) {
        return res.json({ success: [userData.success] });
      } else {
        return res.status(400).json({ error: [userData.error] });
      }
    } catch (error) {
      return res.status(500).json({
        error: "An error occurred during authentication.",
        status: "error",
      });
    }
  },

  userUpdate: async (req, res) => {
    try {
      // console.log(req.params);
      const isUsernameUnique = async (username) => {
        const isUnique = await UserMst.isUnique(username);
        if (!isUnique) {
          throw new Error("Username already exists");
        }
      };

      await Promise.all([
        body("username")
          .notEmpty()
          .withMessage("UserName is required")
          .if(body("username").notEmpty())
          .isLength({ min: 3 })
          .withMessage("UserName should be minimum 3 characters")
          .custom(isUsernameUnique)
          .run(req),

        body("roll").notEmpty().withMessage("Roll is required").run(req),
        body("fname").notEmpty().withMessage("FName is required").run(req),
        body("lname").notEmpty().withMessage("LName is required").run(req),
        body("gender").notEmpty().withMessage("Gender is required").run(req),

        body("email")
          .notEmpty()
          .withMessage("Email is required")
          .if(body("email").notEmpty())
          .isEmail()
          .withMessage("Invalid Email ID")
          .run(req),

        body("mobilenumber")
          .notEmpty()
          .withMessage("Mobile Number is required")
          .if(body("mobilenumber").notEmpty())
          .isNumeric()
          .withMessage("Mobile Number must be numeric")
          .isLength({ min: 10, max: 10 })
          .withMessage("Mobile Number must be 10 digits")
          .if(body("mobilenumber").isLength({ min: 10, max: 10 }))
          .matches(/^[6-9]\d{9}$/)
          .withMessage("Invalid Mobile Number")
          .run(req),

        body("address").notEmpty().withMessage("Address is required").run(req),
        body("departmentid")
          .notEmpty()
          .withMessage("Select Department From Dropdown")
          .run(req),
        body("designationid")
          .notEmpty()
          .withMessage("Select Designation From Dropdown")
          .run(req),
        body("cityid")
          .notEmpty()
          .withMessage("Select City From Dropdown")
          .run(req)
      ]);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ error: errorMessages });
      }

      const userDetails = {
        UserName: req.body.username,
        DepartmentID: req.body.departmentid,
        DesignationID: req.body.designationid,
        Roll: req.body.roll,
        FName: req.body.fname,
        LName: req.body.lname,
        Gender: req.body.gender,
        Email: req.body.email,
        MobileNumber: req.body.mobilenumber,
        Address: req.body.address,
        CityID: req.body.cityid,
        ModifiedBy: req.user.userID,
      };
      const userUpdate = await UserMst.userUpdate(userDetails, req.params.id);
      console.log(userUpdate);

      if (userUpdate.success) {
        return res.json({ success: [userUpdate.success] });
      } else if (userUpdate.error) {
        return res.json({ errors: [userUpdate.error] });
      }

    } catch (error) {
      return res.status(500).json({
        error: "An error occurred during authentication.",
        status: "error",
      });
    }
  },

  // userDelete: async (req, res) => {
  //   // const UserID = req.params.id;

  //   try {
  //     const response = await UserMst.userDelete(req.params.id);
  //     console.log(response);

  //     if (response.success) {
  //       return res.json({ success: [response.success] });
  //     } else if (response.error) {
  //       return res.json({ error: [response.error] });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Internal server error");
  //   }
  // },

  getAllUsers: async (req, res, err) => {
    try {
      const data = await UserMst.getAllUsers(1, 1);
      res.json(data);
    } catch (error) {
      res
        .status(500)
        .json({ error: "An error occurred while retrieving users" });
    }
  },

  isUnique: async (req, res) => {
    const { username } = req.body;
    const user = await UserMst.isUnique(username);
    if (user) {
      res.status(200).json({ success: ["User Name Is Unique"] });
    } else {
      res.status(400).json({ error: ["User Name AllReady Exist"] });
    }
  },

};

const generateOTP = () => {
  // Replace this with your actual OTP generation logic
  // Generate a random OTP and return it
  const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
  return otp.toString();
};

export default loginController;
