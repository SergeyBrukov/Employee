import prismaClient from "../prisma/prisma-client.js";

export const GetInfoUserMiddleware = async (req,res,next) => {
    try {
        const {userId, role} = req.user;

        const dataTableUserRole = role === "OWNER" ? "user" : "employee"

        const user = await prismaClient[dataTableUserRole].findFirst({
            where: {
                id: userId
            }
        })

        if(!user) {
            return res.status(500).send({message: "Somesing were wrong, when try get user info"});
        }

        req.user = {
            ...user,
            userId
        }

        next();

    }catch (e) {
        res.status(500).send({message: "Somesing were wrong, when try get user info"})
    }
}