import {
  generateEligibilityQuiz,
  evaluateEligibility,
} from "../services/geminiEligibility.service.js";
import AllScheme from "../models/all_schemes.model.js";
import User from "../models/User.js";
import PreApplication from "../models/PreApplication.js";

export const getEligibilityQuiz = async (req, res) => {
  try {
    const { schemeId } = req.params;

    const scheme = await AllScheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: "Scheme not found" });
    }

    console.log(
      "Scheme eligibility criteria:",
      scheme.eligibilityDescription_md
    ); // Debug log

    const quiz = await generateEligibilityQuiz(
      scheme.eligibilityDescription_md ||
        scheme.eligibility ||
        "No specific eligibility criteria provided",
      scheme.schemeName
    );

    res.json({
      schemeId,
      schemeName: scheme.schemeName,
      ...quiz,
    });
  } catch (error) {
    console.error("Quiz generation error:", error);
    res
      .status(500)
      .json({ message: "Failed to generate quiz", error: error.message });
  }
};

export const checkEligibility = async (req, res) => {
  try {
    const { schemeId, questions, answers } = req.body;
    const userId = req.userId;

    console.log("Eligibility check request:", { schemeId, questions, answers }); // Debug log

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!schemeId || !questions || !answers) {
      return res.status(400).json({ message: "Missing required data" });
    }

    const [user, scheme] = await Promise.all([
      User.findById(userId),
      AllScheme.findById(schemeId),
    ]);

    if (!user || !scheme) {
      return res.status(404).json({ message: "User or scheme not found" });
    }

    console.log(
      "Using eligibility criteria:",
      scheme.eligibilityDescription_md
    ); // Debug log

    const eligibilityResult = await evaluateEligibility(
      questions,
      answers,
      scheme.eligibilityDescription_md ||
        scheme.eligibility ||
        "No specific eligibility criteria provided"
    );

    // Save eligibility result as PreApplication
    const existingPreApp = await PreApplication.findOne({
      user: userId,
      scheme: schemeId,
    });

    if (existingPreApp) {
      // Update existing PreApplication
      existingPreApp.eligibilityStatus = eligibilityResult.eligible
        ? "eligible"
        : "not_eligible";
      existingPreApp.aiResponse = {
        eligible: eligibilityResult.eligible,
        reason: eligibilityResult.reason,
        questions: questions,
      };
      existingPreApp.userAnswers = new Map(
        questions.map((q, index) => [q, answers[index] ? "Yes" : "No"])
      );
      await existingPreApp.save();
    } else {
      // Create new PreApplication
      const preApplication = new PreApplication({
        user: userId,
        scheme: schemeId,
        eligibilityStatus: eligibilityResult.eligible
          ? "eligible"
          : "not_eligible",
        aiResponse: {
          eligible: eligibilityResult.eligible,
          reason: eligibilityResult.reason,
          questions: questions,
        },
        userAnswers: new Map(
          questions.map((q, index) => [q, answers[index] ? "Yes" : "No"])
        ),
      });
      await preApplication.save();
    }

    res.json({
      schemeId,
      schemeName: scheme.schemeName,
      ...eligibilityResult,
    });
  } catch (error) {
    console.error("Eligibility check error:", error);
    res
      .status(500)
      .json({ message: "Eligibility check failed", error: error.message });
  }
};
