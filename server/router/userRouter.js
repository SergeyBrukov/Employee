/*IMPORT DEPENDENCIES*/

import { Router } from "express";

/*IMPORT CONTROLLERS*/
import { userCurrent, userLogin, userRegister } from "../controllers/usersControllers.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/current", AuthMiddleware, userCurrent)

export default router;