import {Router} from "express";
import {AuthMiddleware} from "../middleware/AuthMiddleware.js";
import {
    AddEmployee,
    DeleteEmployee,
    EditEmployee,
    GetEmployees,
    GetIdEmployee,
    RegisterEmployee
} from "../controllers/employeeController.js";
import {GetInfoUserMiddleware} from "../middleware/GetInfoUserMiddleware.js";

const router = Router();

router.get("/", AuthMiddleware, GetEmployees);

router.get("/:id", AuthMiddleware, GetIdEmployee);

router.post("/add", AuthMiddleware, GetInfoUserMiddleware, AddEmployee);

router.post("/register", RegisterEmployee);

router.delete("/delete/:id", AuthMiddleware, DeleteEmployee);

router.patch("/edit/:id", AuthMiddleware, EditEmployee);


export default router;