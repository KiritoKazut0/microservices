import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import dotenv from "dotenv";
import { authMiddleware } from "./src/middleware.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const PORT = process.env.PORT || 3005;
const app = express();

app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


app.options('*', cors());

app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { msg: "Se ha superado el número máximo de intentos de inicio de sesión." }
});

const serviceLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { msg: "Demasiadas solicitudes. Intenta de nuevo en un minuto." }
});


const proxyOptions = {
  userResHeaderDecorator(headers, userReq, userRes, proxyReq, proxyRes) {
    headers['Access-Control-Allow-Origin'] = '*'; // O tu origen específico
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return headers;
  },
  timeout: 5000 
};



app.use('/api/v1/auth/access', loginLimiter, proxy(process.env.MICROSERVICE_AUTH, proxyOptions));
app.use('/api/v1/auth', proxy(process.env.MICROSERVICE_AUTH, proxyOptions));

app.use('/api/v1/web_scraping', authMiddleware, serviceLimiter, proxy(process.env.MICROSERVICE_WEB_SCRAPING, proxyOptions));
app.use('/api/v1/rag', authMiddleware, serviceLimiter, proxy(process.env.MICROSERVICE_RAG, proxyOptions));
app.use('/api/v1/bias', authMiddleware, serviceLimiter, proxy(process.env.MICROSERVICE_BIAS, proxyOptions));
app.use('/api/v1/llm', authMiddleware, serviceLimiter, proxy(process.env.MICROSERVICE_LLM, proxyOptions));

// Servidor
app.listen(PORT, () => {
  console.log(`API Gateway corriendo en http://localhost:${PORT}`);
});