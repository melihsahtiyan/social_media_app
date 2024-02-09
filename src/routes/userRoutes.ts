import express from "express";
import { body } from "express-validator";
import { fileUpload } from "../util/fileUtil";
import isAuth from "../middleware/is-auth";

const router = express.Router();

router.put("/updateProfile", fileUpload, isAuth);
