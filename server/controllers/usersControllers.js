import prismaClient from "../prisma/prisma-client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailer from "../mailer/nodemailer.js";

dotenv.config();

export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).send({ message: "Plz write necessarily field" });
    }

    const candidate = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    if (candidate) {
      return res.status(400).send({ message: `This user ${email} already exist` });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const user = await prismaClient.user.create({
      data: {
        email,
        name,
        password: hashPassword
      }
    });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWTPASSWORD);

    const mailMessage = {
      to: email,
      subject: `Hello, ${name} you was successfully registration`,
      template: "registerEmail",
      context: {
        name
      }
    };

    mailer(mailMessage);

    res.status(201).send({ message: "User was created", role: user.role, token, name: user.name });
  } catch (err) {
    res.status(500).send({ message: "Somesing were wrong, plz try again" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ message: "Plz write necessarily field" });
    }

    const user = await prismaClient.user.findFirst({
      where: {
        email
      }
    });

    const employee = await prismaClient.employee.findFirst({
      where: {
        email
      }
    });

    if (!user && !employee) {
      return res.status(404).send({ message: "User not found" });
    }

  if(user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(404).send({ message: "Wrong password " });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWTPASSWORD);

   return res.status(200).send({
      // id: user.id,
      // email: user.email,
      name: user.name,
      role: user.role,
      token
    });
  }

    const isPasswordCorrect = employee && (await bcrypt.compare(password, employee.password));

    if (!isPasswordCorrect) {
      return res.status(404).send({ message: "Wrong password " });
    }

    const token = jwt.sign({ userId: employee.id, role: employee.role, }, process.env.JWTPASSWORD);

    return res.status(200).send({
      // id: user.id,
      // email: user.email,
      name: employee.name,
      role: employee.role,
      token
    });

  } catch (err) {
    res.status(500).send({ message: "Somesing were wrong, plz try again" });
  }
};

export const userCurrent = async (req, res) => {

  try {
    const { userId } = req.user;

    const user = await prismaClient.user.findFirst({
      where: {
        id: userId
      }
    });

    const employee = await prismaClient.employee.findFirst({
      where: {
        id: userId
      }
    });

    if (!user && !employee) {
      return res.status(400).send({ message: "User not found" });
    }

    if(user) {
      return  res.status(200).send({
        name: user.name,
        email: user.email,
        role: user.role
      });
    }

    res.status(200).send({
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      role: employee.role
    });

  } catch (err) {
    res.status(500).send({ message: "Somesing were wrong, plz try again" });
  }

};