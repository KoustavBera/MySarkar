import axios from "axios";
export async function translate(text, language = "hi") {
	const fastAPIurl = import.meta.env.VITE_URL;
	const url = `${fastAPIurl}/translate`;

	console.log("Translating:", text, "from", language, "to URL:", url);

	try {
		const res = await axios.post(
			url,
			{ text, language },
			{
				headers: { "Content-Type": "application/json" },
			}
		);

		console.log("Translation response:", res.data.translatedText);
		return res.data.translatedText;
	} catch (error) {
		console.error("Translation failed:", error.response?.data || error.message);
		throw new Error("Translation failed");
	}
}
