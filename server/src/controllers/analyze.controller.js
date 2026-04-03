// import axios from "axios";
import { printTree } from "../utils/treePrinter.js";
import { getRepoStructure } from "../services/github.service.js";

// ==========================================
// CONTROLLER FUNCTIONS
// ==========================================

/**
 * FUNCTION: analyzeRepo
 * PURPOSE: GitHub repository URL ko process karke repo ki file/folder structure dena.
 * 
 * @param {Object} req - Express request object (ismai req.body hogi)
 * @param {Object} res - Express response object (result bhejne ke liye)
 */
export const analyzeRepo = async (req, res) => {
  try {
    // console test
    // console.log(req.body);

    // ==========================================
    // 1. INPUT EXTRACTION
    // ==========================================
    // Request body se repoUrl extract kar rahe hain
    const { repoUrl } = req.body;

    // ==========================================
    // 2. VALIDATION
    // ==========================================
    // Agar URL missing hai, toh 400 Bad Request error return kardenge
    if (!repoUrl) {
      return res.status(400).json({
        error: "Repo URL is required"
      });
    }

    // URL PARSING
    const parts = repoUrl.replace(/\/$/, "").split("/");
    const owner = parts[3]
    const repo = parts[4]

    if (!owner || !repo || !repoUrl.includes("github.com")) {
      return res.status(400).json({
        message: "Invalid repo link"
      });
    }

    // API call start with time checking
    console.time("API Time");

    const structure = await getRepoStructure(owner, repo);

    console.timeEnd("API Time");

    // tree printer
    // printTree(structure);

    return res.json({
      owner,
      repo,
      structure
    });



  } catch (error) {
    res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};