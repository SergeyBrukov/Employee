import prismaClient from "../prisma/prisma-client.js";
import fs from 'fs'

export const getMessagesByChat = async (req, res) => {
    try {
        const {chatIdByEmployee} = req.params;

        const messages = await prismaClient.message.findMany({
            where: {
                chatIdByEmployee
            },
            include: {
                messageFiles: true
            },
            orderBy: {
                date: "desc"
            }
        })

        res.status(200).send({messages})

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"})
    }
}


export const addNewMessage = async (req, res) => {
    try {
        const user = req.user;

        const {date, messageValue, messageFiles, replaceMessageId} = req.body;

        const {chatIdByEmployee} = req.params;

        const authorName = user.role === "OWNER" ? user.name : `${user.firstName} ${user.lastName}`;


        const newMessage = await prismaClient.message.create({
            data: {
                chatIdByEmployee,
                date: String(date),
                authorName,
                replaceMessageId,
                messageValue,
                messageFiles: {
                    create: []
                }
            }
        })


        if (messageFiles.length > 0) {
            if (!fs.existsSync("storage")) {

                fs.mkdir("./storage", (err) => {
                    if (err) return err
                })

            }

            if (!fs.existsSync(`./storage/${user.userId}`)) {
                fs.mkdir(`./storage/${user.userId}`, {recursive: true}, (err) => {
                    if (err) return err
                })
            }

            messageFiles.forEach(file => {

                const {name, type, base64} = file;

                fs.writeFile(`./storage/${user.userId}/${name}`, base64, {encoding: "base64"}, async (err) => {
                    if (err) {
                        return err;
                    }
                    await prismaClient.messageFile.create({
                        data: {
                            name,
                            type,
                            base64,
                            messageId: newMessage.id
                        }
                    })

                })
            })
        }

        res.status(201).send({message: {...newMessage, messageFiles}})

    } catch (e) {
        res.status(500).send({message: "Somesing were wrong, plz try again"})
    }
}