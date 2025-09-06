import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "bn", name: "বাংলা" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "ml", name: "മലയാളം" },
  { code: "gu", name: "ગુજરાતી" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "or", name: "ଓଡ଼ିଆ" },
];

const GoogleTranslateButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [translateLoaded, setTranslateLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const location = useLocation();

  // Load Google Translate Script
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        // Only initialize if available
        if (
          window.google &&
          window.google.translate &&
          window.google.translate.TranslateElement &&
          window.google.translate.TranslateElement.InlineLayout
        ) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: languages.map((l) => l.code).join(","),
              layout:
                window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            "google_translate_element_hidden"
          );
          setTranslateLoaded(true);
        }
      };
      const script = document.createElement("script");
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Apply selected language
  useEffect(() => {
    if (!translateLoaded) return;
    const select = document.querySelector(".goog-te-combo");
    if (select && currentLang) {
      select.value = currentLang;
      select.dispatchEvent(new Event("change"));
    }
  }, [location, currentLang, translateLoaded]);

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    setIsOpen(false);
  };

  return (
    <>
      {/* The div where Google Translate injects itself */}
      <div
        id="google_translate_element_hidden"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
        }}
      ></div>

      {/* Custom Button UI */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium"
          >
            <span>🌐 Translate</span>
            <span
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[200px]">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-100 text-sm ${
                    currentLang === lang.code ? "bg-blue-50 text-blue-600" : ""
                  }`}
                >
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Hide the native Google Translate banner */}
      <style>{`
        .goog-te-banner-frame { display: none !important; } 
        body { top: 0px !important; } 
      `}</style>
    </>
  );
};

export default GoogleTranslateButton;
