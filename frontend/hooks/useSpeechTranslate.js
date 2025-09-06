import { useCallback, useRef, useState } from "react";
import { translate } from "../utils/translator";

export function useSpeechTranslate() {
	const [isListening, setIsListening] = useState(false);
	const [interim, setInterim] = useState("");
	const recognitionRef = useRef(null);
	const timerRef = useRef(null);

	const start = useCallback(
		({ lang = "hi-IN", debounceMs = 1200, selectedLanguage = "hi", onTranslated } = {}) => {
			const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
			if (!SR) {
				alert("Speech recognition not supported in this browser.");
				return;
			}

			const rec = new SR();
			recognitionRef.current = rec;
			rec.lang = lang; // e.g., "hi-IN", "bn-IN", "ta-IN", or navigator.language
			rec.interimResults = true; // partial results for 'real-time feel'
			rec.continuous = true; // keep listening until stopped

			rec.onstart = () => setIsListening(true);
			rec.onerror = () => setIsListening(false);
			rec.onend = () => setIsListening(false);

			rec.onresult = async (event) => {
				let text = "";
				for (let i = event.resultIndex; i < event.results.length; i++) {
					text += event.results[i][0].transcript;
				}
				setInterim(text);

				// Debounce translation calls
				if (timerRef.current) window.clearTimeout(timerRef.current);
				timerRef.current = window.setTimeout(async () => {
					try {
						if (selectedLanguage === "en") {
							// Skip translation for English
							if (onTranslated) onTranslated(text);
						} else {
							const en = await translate(text, selectedLanguage);
							if (onTranslated) onTranslated(en);
						}
					} catch (e) {
						if (onTranslated) onTranslated(text);
					}
				}, debounceMs);
			};

			rec.start();
		},
		[]
	);

	const stop = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			recognitionRef.current = null;
		}
		setIsListening(false);
	}, []);

	return { isListening, interim, start, stop };
}
