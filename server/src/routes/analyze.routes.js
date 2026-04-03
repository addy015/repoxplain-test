/**
 * Ye file GitHub repository analysis ke liye API routes define karti hai.
 * Yahan par endpoints ko unke respective controller functions se map kiya jata hai.
 * Ye ek modular routing structure maintain karne mein help karta hai.
 */

import express from "express";
import { analyzeRepo } from "../controllers/analyze.controller.js";

// Express Router ka instance create kar rahe hain
const router = express.Router();

// ==========================================
// ENDPOINT DEFINITIONS
// ==========================================
/**
 * ROUTE: POST /analyze
 * PURPOSE: User se GitHub repo URL accept karna aur usko analyze karna.
 * LOGIC: Request aane par `analyzeRepo` controller method execute hoga.
 */
// POST request handle karega
router.post("/analyze", analyzeRepo);

// ==========================================
// EXPORT MODULE
// ==========================================
export default router;