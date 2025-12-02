import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import { authMiddleware } from "./src/middleware.js";
import rateLimit from "express-rate-limit";

const PORT = 3005;
const app = express();


app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { msg: "Se ha superado el número máximo de intentos de inicio de sesión. Inténtalo nuevamente en unos minutos." }
});


const serviceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5, // como pediste
  message: { msg: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }
});


app.use('/api/v1/auth/access', loginLimiter, proxy("http://localhost:3000"));
app.use('/api/v1/auth', proxy("http://localhost:3000"));
app.use('/api/v1/web_scraping', authMiddleware, serviceLimiter, proxy("http://localhost:3001"));
app.use('/api/v1/rag', authMiddleware, serviceLimiter, proxy("http://localhost:3002"));
app.use('/api/v1/bias', authMiddleware, serviceLimiter, proxy("http://localhost:3003"));
app.use('/api/v1/llm', authMiddleware, serviceLimiter, proxy("http://localhost:3004"));


app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});
