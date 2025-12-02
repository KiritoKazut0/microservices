import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        msg: "Token not provided"
      });
    }

    const token = authHeader.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SECRET || "DEFAULT_SECRET");
    return next();

  } catch (error) {
    return res.status(401).json({
      msg: "Token invalid"
    });
  }
}
