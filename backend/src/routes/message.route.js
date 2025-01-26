import express from "express";
import { protectRoute } from "../middleware/auth.middlware.js";
import { getUserForsidebar,getMessage, sendMessage} from "../controllers/message.controller.js";
const router = express.Router();
router.get("/user",protectRoute,getUserForsidebar)
router.get("/:id",protectRoute,getMessage)
router.post("/send/:id",protectRoute,sendMessage)
export default router;