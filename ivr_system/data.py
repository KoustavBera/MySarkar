from models import Language

# Government schemes data
SCHEMES = {
    "agriculture": {
        "north": ["PM-KISAN Scheme - Rs 6000/year direct support", "Crop Insurance Scheme"],
        "south": ["Rythu Bandhu - Investment support", "Zero Budget Natural Farming"],
        "east": ["Kalia Scheme - Farmer support", "Rice subsidy schemes"],
        "west": ["Shetkari Samman Nidhi", "Drip irrigation subsidies"],
        "central": ["Soil Health Card", "e-NAM platform"]
    },
    "education": {
        "north": ["Sarva Shiksha Abhiyan", "Mid Day Meal Scheme"],
        "south": ["Free laptop distribution", "Educational scholarships"],
        "east": ["Kanyashree Prakalpa", "Student credit card"],
        "west": ["Digital education initiative", "Higher education scholarships"],
        "central": ["National Scholarship Portal", "Beti Bachao Beti Padhao"]
    },
    "healthcare": {
        "north": ["Ayushman Bharat - Rs 5 lakh coverage", "Janani Suraksha Yojana"],
        "south": ["Aarogyasri Scheme", "104 Health Helpline"],
        "east": ["Swasthya Sathi", "Health insurance schemes"],
        "west": ["Jan Arogya Yojana", "Chiranjeevi Yojana"],
        "central": ["PM Suraksha Bima", "National Health Mission"]
    },
    "employment": {
        "north": ["MGNREGA - 100 days employment", "Skill India Mission"],
        "south": ["Employment guarantee schemes", "Skill development programs"],
        "east": ["Enhanced MGNREGA", "Rural employment programs"],
        "west": ["Youth employment schemes", "Skill training programs"],
        "central": ["PM Mudra Yojana", "Stand Up India"]
    },
    "housing": {
        "north": ["PM Awas Yojana", "Rural housing schemes"],
        "south": ["State housing programs", "Affordable housing"],
        "east": ["Housing assistance schemes", "Rural development programs"],
        "west": ["Affordable housing projects", "Urban housing schemes"],
        "central": ["Credit Linked Subsidy", "Rental housing schemes"]
    },
    "women": {
        "north": ["Beti Bachao Beti Padhao", "Mahila Shakti Kendra"],
        "south": ["Women empowerment schemes", "Self help groups"],
        "east": ["Kanyashree Prakalpa", "Marriage assistance"],
        "west": ["Women development programs", "Self help initiatives"],
        "central": ["PM Matru Vandana Yojana", "Mahila E-Haat"]
    }
}

# Messages
MESSAGES = {
    "welcome": {
        Language.ENGLISH: "Welcome to Government Scheme Helpline. Press 1 for English, 2 for Hindi, 3 for Odia, or 4 for Bengali.",
        Language.HINDI: "सरकारी योजना हेल्पलाइन में स्वागत है। अंग्रेजी के लिए 1, हिंदी के लिए 2, ओड़िया के लिए 3, या बंगाली के लिए 4 दबाएं।"
    },
    "collect_name": {
        Language.ENGLISH: "Please say your name after the beep.",
        Language.HINDI: "कृपया बीप के बाद अपना नाम बताएं।"
    },
    "collect_region": {
        Language.ENGLISH: "Select region: 1-Northern India, 2-Southern India, 3-Eastern India, 4-Western India, 5-Central India.",
        Language.HINDI: "क्षेत्र चुनें: 1-उत्तरी भारत, 2-दक्षिणी भारत, 3-पूर्वी भारत, 4-पश्चिमी भारत, 5-मध्य भारत।"
    },
    "collect_gender": {
        Language.ENGLISH: "Select gender: 1-Male, 2-Female, 3-Other.",
        Language.HINDI: "लिंग चुनें: 1-पुरुष, 2-महिला, 3-अन्य।"
    },
    "collect_scheme": {
        Language.ENGLISH: "Select scheme: 1-Agriculture, 2-Education, 3-Healthcare, 4-Employment, 5-Housing, 6-Women.",
        Language.HINDI: "योजना चुनें: 1-कृषि, 2-शिक्षा, 3-स्वास्थ्य, 4-रोजगार, 5-आवास, 6-महिला।"
    },
    "thank_you": {
        Language.ENGLISH: "Thank you for using Government Scheme Helpline. Goodbye!",
        Language.HINDI: "सरकारी योजना हेल्पलाइन का उपयोग करने के लिए धन्यवाद। अलविदा!"
    }
}