import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const generateEligibilityQuiz = async (
	schemeEligibility,
	schemeName
) => {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const prompt = `
You are creating an eligibility quiz for a government scheme. Based on the EXACT eligibility criteria provided, generate 5 specific yes/no questions that directly test these requirements.

Scheme Name: ${schemeName}

EXACT Eligibility Criteria:
${schemeEligibility}

IMPORTANT INSTRUCTIONS:
1. Read the eligibility criteria CAREFULLY
2. Create questions that directly test the specific requirements mentioned
3. Use exact age ranges, income limits, categories, and conditions from the criteria
4. Make questions specific, not generic
5. Include specific numbers, amounts, or categories mentioned in the criteria

Return ONLY a JSON object:
{
  "questions": [
  	
  ]
}

Example of GOOD specific questions:
- "Are you between 18-35 years old?" (if criteria mentions this age range)
- "Is your annual family income below ₹2 lakh?" (if criteria mentions this amount)
- "Do you belong to Scheduled Caste/Scheduled Tribe category?" (if criteria mentions SC/ST)

Example of BAD generic questions:
- "Do you meet the age criteria?"
- "Do you meet the income criteria?"
`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		// Extract JSON from response
		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			const parsed = JSON.parse(jsonMatch[0]);

			return parsed;
		}

		// Fallback questions
		return {
			questions: [
				"Are you above 18 years of age?",
				"Do you meet the income criteria mentioned in the scheme?",
				"Are you a citizen of India?",
				"Do you have the required documents?",
				"Do you meet the category requirements?",
			],
		};
	} catch (error) {
		console.error("Gemini API Error:", error);
		return {
			questions: [
				"Are you above 18 years of age?",
				"Do you meet the income criteria mentioned in the scheme?",
				"Are you a citizen of India?",
				"Do you have the required documents?",
				"Do you meet the category requirements?",
			],
		};
	}
};

export const evaluateEligibility = async (
	questions,
	answers,
	schemeEligibility
) => {
	try {
		const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

		const qaText = questions
			.map((q, i) => `Q: ${q}\nA: ${answers[i] ? "Yes" : "No"}`)
			.join("\n\n");

		const prompt = `
You are evaluating eligibility for a government scheme based on quiz answers and the EXACT eligibility criteria.

EXACT Eligibility Criteria:
${schemeEligibility}

Quiz Results:
${qaText}

INSTRUCTIONS:
1. Compare each answer against the SPECIFIC requirements in the eligibility criteria
2. Be STRICT - if any critical requirement is not met, mark as NOT eligible
3. Consider ALL requirements, not just some
4. Provide specific reason mentioning which requirement was not met

Return ONLY a JSON object:
{
  "eligible": true/false,
  "reason": "Specific explanation mentioning which exact requirement was/wasn't met",
  "score": 85
}

Be very specific in the reason. Mention exact requirements from the criteria.
`;

		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();

		const jsonMatch = text.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0]);
		}

		// Fallback evaluation
		const yesCount = answers.filter(Boolean).length;
		const score = (yesCount / questions.length) * 100;

		return {
			eligible: score >= 80,
			reason:
				score >= 80
					? "You meet most of the eligibility criteria based on your answers"
					: "You don't meet enough eligibility criteria based on your answers",
			score: Math.round(score),
		};
	} catch (error) {
		console.error("Gemini Evaluation Error:", error);
		const yesCount = answers.filter(Boolean).length;
		const score = (yesCount / questions.length) * 100;

		return {
			eligible: score >= 80,
			reason:
				score >= 80
					? "You meet most of the eligibility criteria based on your answers"
					: "You don't meet enough eligibility criteria based on your answers",
			score: Math.round(score),
		};
	}
};
