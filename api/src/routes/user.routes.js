import { Router } from "express";
import { getUsers, createUser, updateUserDetails, updateUserPassword, deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.get("/", getUsers);
router.post("/", createUser);
router.patch("/name/:userId", updateUserDetails);
router.patch("/password/:userId", updateUserPassword);
router.delete("/:userId", deleteUser);

export default router;