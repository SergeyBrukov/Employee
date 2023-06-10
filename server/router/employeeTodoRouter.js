import {Router} from "express";
import {
    CreateEmployeeTodo,
    GetEmployeeTodos,
    GetEmployeeTodoItem,
    ChangeTodoComplete
} from "../controllers/employeeTodoController.js";
import {AuthMiddleware} from "../middleware/AuthMiddleware.js";

const router = Router();


router.get("/:employeeId", AuthMiddleware, GetEmployeeTodos);

router.get("/employee-todo-get-todo/:todoId",  AuthMiddleware, GetEmployeeTodoItem)

router.patch("/change-complete-todo/:todoId", AuthMiddleware, ChangeTodoComplete)

router.post("/create/:employeeId", AuthMiddleware, CreateEmployeeTodo);



export default router