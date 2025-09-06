import React, { useState, useEffect } from "react";
import axios from "axios";
import useConfigStore from "../stores/configStore";
import useAuthStore from "../stores/authStore";
import { toast } from "react-hot-toast";
import {
	XMarkIcon,
	CheckCircleIcon,
	XCircleIcon,
} from "@heroicons/react/24/outline";

const EligibilityCheckModal = ({ isOpen, onClose, scheme, onEligible }) => {
	const { backendUrl } = useConfigStore();
	const { token } = useAuthStore();
	const [loading, setLoading] = useState(false);
	const [quizLoading, setQuizLoading] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState([]);
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [result, setResult] = useState(null);
	const [showQuiz, setShowQuiz] = useState(false);

	useEffect(() => {
		if (isOpen && scheme) {
			fetchQuiz();
		}
	}, [isOpen, scheme]);

	const fetchQuiz = async () => {
		if (!scheme || !scheme._id) {
			toast.error("Scheme information is missing");
			return;
		}

		setQuizLoading(true);
		try {
			const response = await axios.get(
				`${backendUrl}/api/v1/eligibility/quiz/${scheme._id}`,
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Handle both string and object question formats
			const questionList = response.data.questions.map((q) =>
				typeof q === "string" ? q : q.question || q.text || String(q)
			);

			setQuestions(questionList);
			setAnswers(new Array(questionList.length).fill(null));
			setCurrentQuestion(0);
			setShowQuiz(true);
		} catch (error) {
			console.error("Quiz fetch error:", error);
			toast.error("Failed to load eligibility quiz");
		} finally {
			setQuizLoading(false);
		}
	};

	const handleAnswer = (answer) => {
		const newAnswers = [...answers];
		newAnswers[currentQuestion] = answer;
		setAnswers(newAnswers);

		if (currentQuestion < questions.length - 1) {
			setCurrentQuestion(currentQuestion + 1);
		} else {
			checkEligibility(newAnswers);
		}
	};

	const checkEligibility = async (finalAnswers) => {
		setLoading(true);
		try {
			const response = await axios.post(
				`${backendUrl}/api/v1/eligibility/check`,
				{
					schemeId: scheme._id,
					questions: questions,
					answers: finalAnswers,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setResult(response.data);
			setShowQuiz(false);
		} catch (error) {
			console.error("Eligibility check error:", error);
			toast.error("Failed to check eligibility");
		} finally {
			setLoading(false);
		}
	};

	const handleApply = () => {
		if (!scheme || !scheme._id) {
			toast.error("Scheme information is missing");
			return;
		}
		onEligible(scheme._id);
		onClose();
	};

	const resetQuiz = () => {
		setCurrentQuestion(0);
		setAnswers(new Array(questions.length).fill(null));
		setResult(null);
		setShowQuiz(true);
	};

	if (!isOpen || !scheme) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
			<div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center mb-4">
					<h3 className="text-lg font-semibold">Eligibility Quiz</h3>
					<button onClick={onClose}>
						<XMarkIcon className="w-6 h-6" />
					</button>
				</div>

				<div className="mb-4">
					<h4 className="font-medium mb-2">{scheme?.schemeName}</h4>
					<p className="text-sm text-gray-600">
						Answer a few questions to check your eligibility
					</p>
				</div>

				{quizLoading ? (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Generating personalized quiz...</p>
					</div>
				) : showQuiz && questions.length > 0 ? (
					<div className="space-y-4">
						{/* Progress Bar */}
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{
									width: `${((currentQuestion + 1) / questions.length) * 100}%`,
								}}
							></div>
						</div>

						{/* Question Counter */}
						<p className="text-sm text-gray-500 text-center">
							Question {currentQuestion + 1} of {questions.length}
						</p>

						{/* Current Question */}
						<div className="bg-gray-50 rounded-lg p-4">
							<h5 className="font-medium mb-4 text-lg">
								{questions[currentQuestion]}
							</h5>

							<div className="space-y-2">
								<button
									onClick={() => handleAnswer(true)}
									className="w-full p-3 text-left border rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
								>
									✅ Yes
								</button>
								<button
									onClick={() => handleAnswer(false)}
									className="w-full p-3 text-left border rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors"
								>
									❌ No
								</button>
							</div>
						</div>

						{/* Previous Button */}
						{currentQuestion > 0 && (
							<button
								onClick={() => setCurrentQuestion(currentQuestion - 1)}
								className="w-full py-2 text-gray-600 hover:text-gray-800"
							>
								← Previous Question
							</button>
						)}
					</div>
				) : loading ? (
					<div className="text-center py-8">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
						<p className="text-gray-600">Evaluating your eligibility...</p>
					</div>
				) : result ? (
					<div className="space-y-4">
						<div
							className={`flex items-center space-x-2 p-4 rounded-md ${
								result.eligible
									? "bg-green-50 text-green-800"
									: "bg-red-50 text-red-800"
							}`}
						>
							{result.eligible ? (
								<CheckCircleIcon className="w-6 h-6" />
							) : (
								<XCircleIcon className="w-6 h-6" />
							)}
							<div>
								<span className="font-medium block">
									{result.eligible ? "🎉 You're Eligible!" : "❌ Not Eligible"}
								</span>
								{result.score && (
									<span className="text-sm">Score: {result.score}%</span>
								)}
							</div>
						</div>

						<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
							{result.reason}
						</p>

						<div className="flex space-x-2">
							{result.eligible ? (
								<button
									onClick={handleApply}
									className="flex-1 bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
								>
									Proceed to Apply
								</button>
							) : (
								<button
									onClick={resetQuiz}
									className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
								>
									Retake Quiz
								</button>
							)}
							<button
								onClick={onClose}
								className="flex-1 bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700"
							>
								Close
							</button>
						</div>
					</div>
				) : (
					<div className="text-center py-8">
						<p className="text-gray-600 mb-4">Failed to load quiz</p>
						<button
							onClick={fetchQuiz}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Try Again
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default EligibilityCheckModal;
