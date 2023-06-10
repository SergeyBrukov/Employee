import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const AuthMiddleware = async (req, res, next) => {
  try {

    const token = req.headers.authorization.split("Bearer")[1].trim();

    if (!token) {
      return res.status(401).send({ message: "Not authorized" });
    }

    const user = jwt.verify(token, process.env.JWTPASSWORD);

    req.user = { userId: user.userId, role: user.role };

    next();
  } catch (err) {
    res.status(500).send({ message: "Somesing were wrong, plz try again" });
  }
};