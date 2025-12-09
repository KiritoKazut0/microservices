import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import amqp, { Channel, ConsumeMessage } from 'amqplib';
import axios from 'axios';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from "uuid"
import ResponseScraping from './src/interface/ResponseScraping';


// --- INTERFACES ---
interface ServiceUrls {
    SCRAPING: string;
    RAG: string;
    BIAS: string;
    LLM: string
}

interface AnalysisPayload {
    id_analisis: string;
    url: string;
    fcm_token?: string;
    text_user: string
}

// --- CONFIGURACIÓN ---
const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}));

const PORT = process.env.PORT || 4000;
const AMQP_URL = process.env.CLOUDAMQP_URL as string;

const QUEUE_NOTICE = 'analisis_notice';
const QUEUE_COMMENTS = 'analisis_comments'
const QUEUE_ERROR = 'global_errors';
const DLX_NAME = 'dead_letter_exchange';

const SERVICES: ServiceUrls = {
    SCRAPING: process.env.SCRAPING_SERVICE_URL || 'http://web_scraping:3001/scraped',
    RAG: process.env.RAG_SERVICE_URL || 'http://rag:5001/rag',
    BIAS: process.env.BIAS_SERVICE_URL || 'http://bias:5002/bias',
    LLM: process.env.LLM_SERVICE_URL || 'http://llm:5003/llm'
};

//  --- FIREBASE ---
 try {

     admin.initializeApp({
         credential: admin.credential.cert({
            projectId: process.env["FIREBASE_PROJECT_ID"] || "",
            clientEmail: process.env["FIREBASE_CLIENT_EMAIL"] || "",
            privateKey: process.env["FIREBASE_PRIVATE_KEY"] || ""
         })
     });
     console.log("🔥 Firebase inicializado.");
 } catch (error) {
     console.log(error);
     console.warn("⚠️ Sin firebase-service-account.json. Notificaciones desactivadas.");
 }

// Declaramos channel pudiendo ser null
let channel: Channel | null = null;

// --- RABBITMQ ---
async function startRabbitMQ() {
    try {
        console.log("🐰 Conectando a CloudAMQP...");

        const connection = await amqp.connect(AMQP_URL);
        channel = await connection.createChannel();

        await channel.assertExchange(DLX_NAME, 'direct', { durable: true });
        await channel.assertQueue(QUEUE_ERROR, { durable: true });
        await channel.bindQueue(QUEUE_ERROR, DLX_NAME, 'error_key');

        await channel.assertQueue(QUEUE_COMMENTS, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': DLX_NAME,
                'x-dead-letter-routing-key': 'error_key'
            }
        });

        await channel.assertQueue(QUEUE_NOTICE, {
            durable: true,
            arguments: {
                'x-dead-letter-exchange': DLX_NAME,
                'x-dead-letter-routing-key': 'error_key'
            }
        });

        console.log("✅ Sistema de Colas Listo.");
        consumeMessages();

    } catch (error) {
        console.error("❌ Error RabbitMQ (Reintentando en 5s):", error);
        setTimeout(startRabbitMQ, 5000);
    }
}

// --- WORKER ---
function consumeMessages() {
    if (!channel) return;

    console.log("👷 Worker esperando tareas...");

    channel.consume(QUEUE_NOTICE, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());
        const { id_analisis, url, fcm_token, text_user } = content;

        console.log(`\n🚀 [${id_analisis}] Procesando: ${url}`);

        try {
            console.log(`   [1/3] Scraping...`);
            const resScraping = await axios.post(`${SERVICES.SCRAPING}/scraped`, { url });
            const dataScraping = resScraping.data as ResponseScraping;
            const sendDataBiasService = {
                title: dataScraping.title,
                paragraphs: dataScraping.mainContent,
                user_text: text_user
            }

            console.log(`   [2/3] Bias...`);
            const biasData = await axios.post(`${SERVICES.BIAS}/analyze`, sendDataBiasService);

            console.log(`   [3/3] LLM...`);
            const llmData = await axios.post(`${SERVICES.LLM}/analysis/process`, biasData.data)
            const message = JSON.stringify(llmData.data);
            
            await sendNotification(fcm_token, "Análisis Completado", message, "success");
            channel?.ack(msg);

        } catch (error: any) {
            console.error(error)
            console.error(`❌ [${id_analisis}] ERROR.`);
            await sendNotification(fcm_token, "Error", "Fallo al procesar.", "error");
            channel?.ack(msg);
        }
    });

    channel.consume(QUEUE_COMMENTS, async (msg: ConsumeMessage | null) => {
        if (!msg) return;

        const content = JSON.parse(msg.content.toString());
        const { id_analisis, fcm_token, text_user } = content;
        
        console.log(`\n🚀 [${id_analisis}] Procesando: tarea`);
        try {
            const llmData = await axios.post(`${SERVICES.LLM}/analysis/rag`, { text: text_user });
            const paragraphs = llmData.data.data.questions_for_rag;

             const ragData = await axios.post(`${SERVICES.RAG}/rag/query`, {
                questions_for_rag: paragraphs
            });

             const sendDataBiasService = {
              rag_results : ragData.data.results,
              user_text: text_user
            }
             const biasData = await axios.post(`${SERVICES.BIAS}/analyze-rag`, sendDataBiasService);

            const llmResult = await axios.post(`${SERVICES.LLM}/analysis/process`, biasData.data)
            const message = JSON.stringify(llmResult.data);
            await sendNotification(fcm_token, "Análisis Completado", message, "success");

             channel?.ack(msg);

        } catch (error) {
            console.error(error)
            console.error(`❌ [${id_analisis}] ERROR.`);
            await sendNotification(fcm_token, "Error", "Fallo al procesar.", "error");

            // Usamos ?.ack aquí también
            channel?.ack(msg); 
        }
    });
}

// --- NOTIFICACIONES ---
 async function sendNotification(token: string | undefined, title: string, body: string, type: string) {
     if (!token) return;
     try {
         await admin.messaging().send({
             token,
             notification: { title, body },
             data: { type }
         });
     } catch (e) { console.log(e) }
 }

// --- ENDPOINT ---
app.post('/analysis/notice', async (req: Request, res: Response): Promise<any> => {
    const { url, fcm_token, text_user } = req.body;
    if (!url || !text_user) return res.status(400).json({
        error: "Is requiered field url or text_user"
    });

    const id_analisis = `job_${uuidv4()}`;
    if (channel) {
        try {
            channel.sendToQueue(QUEUE_NOTICE, Buffer.from(JSON.stringify({ id_analisis, url, fcm_token, text_user })));
            return res.status(202).json({ message: "Iniciado", id: id_analisis });
        } catch (e) {
            console.error(e)
            return res.status(500).json({ error: "Error interno RabbitMQ" });
        }
    } else {
        return res.status(503).json({ error: "Servicio no listo" });
    }
});


app.post('/analysis/comments', async (req: Request, res: Response): Promise<any> => {
    const {  fcm_token, text_user } = req.body;
    if (!text_user) return res.status(400).json({
        error: "Is requiered field text_user"
    });

    const id_analisis = `job_${uuidv4()}`;
    if (channel) {
        try {
            channel.sendToQueue(QUEUE_COMMENTS, Buffer.from(JSON.stringify({ id_analisis, fcm_token, text_user })));
            return res.status(202).json({ message: "Iniciado", id: id_analisis });
        } catch (e) {
            console.error(e)
            return res.status(500).json({ error: "Error interno RabbitMQ" });
        }
    } else {
        return res.status(503).json({ error: "Servicio no listo" });
    }
});

app.listen(PORT, () => {
    console.log(`🌐 Events corriendo en puerto ${PORT}`);
    startRabbitMQ();
});