import express from "express";

import { 
    login, logout, register,
    addFunds, withdrawFunds

 } from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";


const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/add").post( isAuthenticated, addFunds);
router.route("/withdraw").post( isAuthenticated, withdrawFunds);


export default router;