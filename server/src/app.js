/**
 * ==========================================
 * HIGH-LEVEL OVERVIEW
 * ==========================================
 * Ye file hamari Express application ka core setup hai.
 * Yahan par hum middlewares (jaise CORS, JSON parser) configure karte hain 
 * aur sabhi base routes ko app ke sath register karte hain.
 * Ise alag rakha gaya hai taaki testing aur routing aasan ho sake.
 */

import express from "express";
import cors from "cors";
import analyzeRoutes from "./routes/analyze.routes.js"

// ==========================================
// APP INITIALIZATION
// ==========================================
// Express instance create kar rahe hain
const app = express();

// ==========================================
// MIDDLEWARES SETUP
// ==========================================
// CORS policy enable kar rahe hain taaki frontend se cross-origin requests aa sakein
app.use(cors());

// Incoming JSON payload ko parse karne ke liye middleware
// Iske bina req.body undefined aayega
app.use(express.json());

// ==========================================
// ROUTES REGISTRATION
// ==========================================
/**
 * '/api' prefix ke sath analyzeRoutes register kar rahe hain.
 * Iska matlab analyze.routes.js ke saare endpoints '/api' se start honge.
 * Example: POST /api/analyze
 */
app.use("/api", analyzeRoutes);

// ==========================================
// EXPORT
// ==========================================
// App instance ko export kar rahe hain taaki server.js isko use kar sake
export default app;