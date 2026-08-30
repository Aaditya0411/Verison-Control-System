const express = require('express')
const userController = require('../controllers/userController');

const userRouter =  express.Router();


userRouter.get("/allusers" , userController.getAllUsers);
userRouter.post("/signup" , userController.signup);
userRouter.post("/login" , userController.Login);
userRouter.get("/userProfile" , userController.getUserProfile);
userRouter.put("/updateProfile" , userController.updateUserProfile);
userRouter.delete("/deleteProfile" , userController.deleteUserProfile);

module.exports = userRouter;