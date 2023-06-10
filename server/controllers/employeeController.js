import prismaClient from "../prisma/prisma-client.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import mailer from "../mailer/nodemailer.js";
import bcrypt from "bcrypt";

dotenv.config();

export const GetEmployees = async (req, res) => {
    try {

        const {userId} = req.user;

        const {pageItems, currentPage, searchEmployeesValue, statusSearch} = req.query;

        const offsetSkipItems = (currentPage - 1) * pageItems;
        const limit = pageItems;


        let whereClause = {
            userId,
            OR: [
                {firstName: {contains: searchEmployeesValue}},
                {lastName: {contains: searchEmployeesValue}},
                {email: {contains: searchEmployeesValue}},
            ]
        };

        if (statusSearch !== "all") {
            whereClause.status = statusSearch;
        }

        const employees = await prismaClient.employee.findMany({
            where: whereClause,
            skip: Number(offsetSkipItems),
            take: Number(limit)
        });


        const countEmployees = await prismaClient.employee.count({
            where: whereClause
        });

        const totalPage = Math.ceil(countEmployees / limit);

        res.status(200).send({employees, totalPage});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
};

export const GetIdEmployee = async (req, res) => {
    try {

        const {id} = req.params;

        const employee = await prismaClient.employee.findFirst({
            where: {
                id
            }
        });

        const {password, ...otherInfo} = employee

        res.status(200).send({employee: otherInfo});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
};

export const AddEmployee = async (req, res) => {
    try {
        const {userId, name: ownerName} = req.user;
        const {firstName, lastName, age, address, email} = req.body;

        if (!firstName || !lastName || !age || !address) {
            return res.status(400).send({message: "Plz write necessary field"});
        }

        const newEmployee = await prismaClient.employee.create({
            data: {
                firstName,
                lastName,
                age,
                address,
                userId,
                email
            }
        });

        const tokenInviteByEmployee = jwt.sign({id: newEmployee.id}, process.env.JWTPASSWORD);

        const message = {
            to: email,
            subject: "Invite for you",
            template: "addEmployeeEmail",
            context: {
                employeeName: firstName + lastName,
                ownerName,
                loginLink: `${process.env.DEFAULT_URL_CLIENT}/register-employee/${tokenInviteByEmployee}/${email}`
            }
        }

        mailer(message)

        res.status(201).send({newEmployee});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
};

export const DeleteEmployee = async (req, res) => {
    try {
        const {id} = req.params;

        await prismaClient.employee.delete({
            where: {
                id
            }
        });

        res.status(200).send({message: "Successfully"});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
};

export const EditEmployee = async (req, res) => {
    try {
        const {id} = req.params;

        const {firstName, lastName, age, address} = req.body;

        const findEmployeeAndUpdate = await prismaClient.employee.update({
            where: {
                id
            },
            data: {
                firstName, lastName, age, address
            }
        });

        res.status(200).send({message: "Successfully", updateEmployee: findEmployeeAndUpdate});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
};


/*Register employee*/

export const RegisterEmployee = async (req, res) => {
    try {
        const {email, password, token: inviteToken} = req.body;

        const idEmployeeByToken = jwt.verify(inviteToken, process.env.JWTPASSWORD)

        if (!idEmployeeByToken.id) {
            return res.status(404).send({message: "Token not found"});
        }

        const employeeByToken = await prismaClient.employee.findFirst({
            where: {
                id: idEmployeeByToken.id
            }
        });

        if (!employeeByToken) {
            return res.status(404).send({message: "Employee for this token not found"});
        }

        if (email !== employeeByToken.email) {
            return res.status(404).send({message: "You must do register with email which write owner"})
        }

        const hashPassword = await bcrypt.hash(password, 12);

        await prismaClient.employee.update({
            where: {
                id: idEmployeeByToken.id
            },
            data: {
                password: hashPassword,
                status: "completed"
            }
        })

        const token = jwt.sign({userId: idEmployeeByToken.id}, process.env.JWTPASSWORD);

        return res.status(200).send({token, role: employeeByToken.role});

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"});
    }
}