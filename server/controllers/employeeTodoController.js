import prismaClient from "../prisma/prisma-client.js";

export const GetEmployeeTodos = async (req, res) => {
    try {
        const {employeeId} = req.params;
        const {itemPerPage, page, searchTodoForEmployee, statusSearch} = req.query;

        const skipItem = (page - 1) * itemPerPage

        let objectSearchParams = {
            employeeId,
            OR: [
                {title: {contains: searchTodoForEmployee}},
                {description: {contains: searchTodoForEmployee}},
            ]
        }

        if (statusSearch && statusSearch !== "all") {
            objectSearchParams.complete = statusSearch === "completed"
        }

        const examinationEmployee = await prismaClient.employee.findFirst({
            where: {
                id: employeeId
            }
        })

        if (!examinationEmployee) {
            return res.status(404).send({message: "Employee whose you wand add todo not found"});
        }

        const todos = await prismaClient.todo.findMany({
            where: objectSearchParams,
            skip: Number(skipItem),
            take: Number(itemPerPage)
        });

        const totalItems = await prismaClient.todo.count({
            where: objectSearchParams
        });

        const totalPage = Math.ceil(totalItems / itemPerPage)

        res.status(200).send({todos, totalPage})

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"})
    }
}

export const CreateEmployeeTodo = async (req, res) => {
    try {
        const {title, description} = req.body;
        const {employeeId} = req.params;

        const examinationEmployee = await prismaClient.employee.findFirst({
            where: {
                id: employeeId
            }
        })

        if (!examinationEmployee) {
            return res.status(404).send({message: "Employee whose you wand add todo not found"});
        }

        const newTodo = await prismaClient.todo.create({
            data: {
                title,
                description,
                complete: false,
                employeeId
            }
        })

        res.status(201).send({message: "Todo was created", todo: newTodo})

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"})
    }
}


export const EditEmployeeTodo = async (req, res) => {
    try {
        const {title, description, complete, todoId} = req.body;

        const findTodo = await prismaClient.todo.findFirst({
            where: {
                id: todoId
            }
        });

        if (!findTodo) {
            return res.status(404).send({message: "Todo not found"});
        }

        await prismaClient.todo.update({
            where: {
                id: todoId
            },
            data: {
                title,
                description,
                complete
            }
        })

        res.status(200).send({message: "Todo was updated"})

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
}

export const DeleteEmployeeTodo = async (req, res) => {
    try {
        const {todoId} = req.params;

        const findTodo = await prismaClient.todo.findFirst({
            where: {
                id: todoId
            }
        });

        if (!findTodo) {
            return res.status(404).send({message: "Todo not found"});
        }

        await prismaClient.todo.delete({
            where: {
                id: todoId
            }
        })

        res.status(200).send({message: "Todo was deleted"})

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
}


export const GetEmployeeTodoItem = async (req, res) => {
    try {
        const {todoId} = req.params;

        const todoItem = await prismaClient.todo.findFirst({
            where: {
                id: todoId
            }
        })

        res.status(200).send({todo: todoItem})

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
}

export const ChangeTodoComplete = async (req, res) => {
    try {
        const {todoId} = req.params;

        const todoItem = await prismaClient.todo.findUnique({
            where: {
                id: todoId
            }
        })

        const updateTodo = await prismaClient.todo.update({
            where: {
                id: todoId
            },
            data: {
                complete: !todoItem.complete
            }
        })


        res.status(200).send({todo: updateTodo});

    } catch (err) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
}