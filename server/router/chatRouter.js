import {Router} from "express";
import {AuthMiddleware} from "../middleware/AuthMiddleware.js";
import {GetInfoUserMiddleware} from "../middleware/GetInfoUserMiddleware.js";
import {addNewMessage, getMessagesByChat} from "../controllers/chatControllers.js";


const router = Router();


router.get("/get-messages/:chatIdByEmployee", AuthMiddleware, getMessagesByChat);
router.post("/send-message/:chatIdByEmployee", AuthMiddleware, GetInfoUserMiddleware,addNewMessage);

export default router