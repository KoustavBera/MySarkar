import express from "express";
import { checkEligibility, getEligibilityQuiz } from "../controllers/eligibility.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const eligibilityRouter = express.Router();

eligibilityRouter.get("/quiz/:schemeId", authenticateToken, getEligibilityQuiz);
eligibilityRouter.post("/check", authenticateToken, checkEligibility);

export default eligibilityRouter;