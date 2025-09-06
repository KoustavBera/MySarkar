// Sample schemes data - expanded for better filtering
export default [
  {
    id: 1,
    title:
      "Pradhan Mantri Matsya Sampada Yojana: Medium Scale Ornamental Fish Rearing Unit (Fresh Water) - Haryana",
    state: "Haryana",
    schemeType: "state",
    category: "Agriculture",
    description:
      "Under this scheme, financial assistance in the form of a subsidy is provided to eligible beneficiaries for setting up infrastructure such as sheds, breeding units, and rearing and culture tanks for ornamental fish.",
    tags: [
      "Fish",
      "Fish Farmer",
      "Fish Production",
      "Fish Rearing Unit",
      "Fresh Water",
      "Ornamental Aquaculture",
      "Subsidy",
    ],
    ministry: "Fisheries Department",
    benefitType: "Subsidy",
    targetGender: "All",
    targetAge: "18-60",
    targetCaste: "All",
    residence: "All",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Farmer",
    details: {
      description:
        'The "Subsidy for Medium Scale Ornamental Fish Rearing Unit (Fresh Water)" is a scheme component under the Pradhan Mantri Matsya Sampada Yojana (PMMSY), implemented by the Fisheries Department, Government of Haryana. This Centrally Sponsored Scheme aims to promote ornamental fish farming as a sustainable livelihood option.\n\nUnder this scheme, financial assistance in the form of a subsidy is provided to eligible beneficiaries for setting up infrastructure such as sheds, breeding units, and rearing and culture tanks for ornamental fish. The assistance will be provided to beneficiaries who own a minimum of 150 square meters of vacant land with an adequate fresh water facility.',
      benefits: {
        tangible: [
          "Project Cost: ₹8,00,000/- per unit",
          "Subsidy will be limited to 40% of the project cost for General Category applicant.",
          "Subsidy will be limited to 60% of the project cost for Scheduled Caste (SC)/Women beneficiaries.",
        ],
      },
      eligibility: [
        "The applicant should be a resident of Haryana.",
        "The applicant should possess a valid Parivar Pehchan Patra (Family ID).",
        "The applicant should have at least 150 square meters of vacant land with adequate water supply.",
        "The applicant should either own the land or possess a registered lease deed valid for at least 7 years.",
      ],
      applicationProcess: {
        type: "Online",
        subType: "Online - via CSCs",
        steps: [
          {
            title: "Registration Process on Antyodaya-SARAL Portal:",
            steps: [
              "Visit the Official Portal: Antyodaya-SARAL Portal.",
              "For registration, click on \"New User/Register Here\" and fill in all the mandatory details i.e. Name, Email ID, Mobile Number & password. Click on 'Submit'.",
              "Verify the OTP received in the provided Email and Mobile Number. Alternatively, click on the Verification Link to activate the profile.",
            ],
          },
          {
            title: "Login to Apply for the Scheme:",
            steps: [
              "Visit the Official Portal: Antyodaya-SARAL Portal.",
              "The \"Sign in here\" option is available on the right side of the screen. Fill in the required credentials and click on the 'Login' button.",
              'In the opened window, click on "Scheme/Services list" and a list of schemes will appear on the screen.',
              'Now, select the scheme and click on "Apply for Service/Scheme".',
              'Fill in all the details in the online application form and click on "Submit".',
            ],
          },
        ],
        tracking: {
          online: [
            "Track Application/Appeal: Click here.",
            "Track Ticket: Click here.",
          ],
          sms: [
            "Registered Mobile Number: Type SARAL and send to 9954699899 to track your application.",
            "Other Mobile Number: Type SARAL<space><Application ID/Ticket No.> and send to 9954699899 to track your application/ticket.",
          ],
        },
        contact: {
          helpline: "0172-3968400",
          email: "saral.haryana@gov.in",
        },
        fees: [
          "Government Charges: ₹0 (No Fee)",
          "Service Charges: ₹10",
          "Atal Seva Kendra Charges: ₹10",
        ],
      },
      documents: [
        "Agreement Letter-1: Agreement letter between the beneficiary and the department",
        "Birth Certificate - Voter ID Card/Date of Birth Certificate/Aadhaar Card/Class 10th Certificate",
        "Caste Certificate - Caste certificate issued by a First-Class Magistrate (Tehsildar)",
        "Fisheries Training Certificate of the Applicant",
        "Land Records: Land records from the Tehsil (land registry, copy of Aksasra Fard) or registered lease deed",
        "Bill/Receipt/Voucher",
        "Photograph of the beneficiary with the unit",
        "Bank account and PAN card details",
        "Detailed Project Report (DPR)/Self-Contained Proposal (SCP) as per the guidelines issued under the Centrally Sponsored Scheme PMMSY",
      ],
    },
  },

  {
    id: 3,
    title: "Pradhan Mantri Kisan Samman Nidhi Yojana - Punjab",
    state: "Punjab",
    schemeType: "central",
    category: "Agriculture",
    description:
      "PM-KISAN is a Central Sector Scheme with 100% funding from Government of India. It provides income support to farmer families across the country.",
    tags: [
      "Farmer",
      "Income Support",
      "Agriculture",
      "Direct Benefit Transfer",
    ],
    ministry: "Ministry of Agriculture and Farmers Welfare",
    benefitType: "Direct Transfer",
    targetGender: "All",
    targetAge: "18-70",
    targetCaste: "All",
    residence: "Rural",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Farmer",
    details: {
      description:
        "PM-KISAN is a Central Sector Scheme with 100% funding from Government of India. Under the scheme, financial benefit of Rs.6000/- per year is transferred in three equal installments of Rs.2000/- each every four months into the bank accounts of farmer families.",
      benefits: {
        tangible: [
          "Financial assistance of ₹6,000 per year",
          "Amount transferred in 3 installments of ₹2,000 each",
          "Direct benefit transfer to bank account",
        ],
      },
      eligibility: [
        "Small and marginal farmer families",
        "Land holding up to 2 hectares",
        "Must be an Indian citizen",
      ],
      applicationProcess: {
        type: "Online/Offline",
        steps: [
          {
            title: "Online Application:",
            steps: [
              "Visit PM-KISAN portal",
              "Click on 'Farmers Corner'",
              "Select 'New Farmer Registration'",
              "Fill required details and submit",
            ],
          },
        ],
      },
      documents: [
        "Aadhaar Card",
        "Bank account details",
        "Land ownership documents",
        "Mobile number",
      ],
    },
  },
  {
    id: 4,
    title: "Skill Development Training for Women - Delhi",
    state: "Delhi",
    schemeType: "state",
    category: "Employment",
    description:
      "Skill development and training program specifically designed for women to enhance their employability and entrepreneurship skills.",
    tags: [
      "Women",
      "Skill Development",
      "Training",
      "Employment",
      "Entrepreneurship",
    ],
    ministry: "Delhi Skill and Entrepreneurship University",
    benefitType: "Training",
    targetGender: "Female",
    targetAge: "18-45",
    targetCaste: "All",
    residence: "All",
    maritalStatus: "All",
    employmentStatus: "Unemployed",
    occupation: "Any",
    details: {
      description:
        "This scheme provides comprehensive skill development training for women to improve their employability and support entrepreneurship initiatives.",
      benefits: {
        tangible: [
          "Free skill development training",
          "Certificate upon completion",
          "Placement assistance",
          "Monthly stipend during training",
        ],
      },
      eligibility: [
        "Must be a woman",
        "Age between 18-45 years",
        "Resident of Delhi",
        "Basic educational qualification",
      ],
      applicationProcess: {
        type: "Online",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit Delhi Skills portal",
              "Register with basic details",
              "Select preferred course",
              "Submit application with documents",
            ],
          },
        ],
      },
      documents: [
        "Identity proof",
        "Address proof",
        "Educational certificates",
        "Passport size photographs",
      ],
    },
  },
  {
    id: 5,
    title: "Senior Citizen Healthcare Scheme - Uttar Pradesh",
    state: "Uttar Pradesh",
    schemeType: "state",
    category: "Healthcare",
    description:
      "Comprehensive healthcare coverage for senior citizens aged 60 and above in Uttar Pradesh.",
    tags: ["Senior Citizen", "Healthcare", "Medical Insurance", "Elderly Care"],
    ministry: "Department of Health, UP Government",
    benefitType: "Insurance",
    targetGender: "All",
    targetAge: "60+",
    targetCaste: "All",
    residence: "All",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Any",
    details: {
      description:
        "This scheme provides comprehensive healthcare coverage including hospitalization, medicines, and regular health check-ups for senior citizens.",
      benefits: {
        tangible: [
          "Free medical treatment up to ₹5,00,000 per year",
          "Free medicines",
          "Regular health check-ups",
          "Specialized geriatric care",
        ],
      },
      eligibility: [
        "Age 60 years and above",
        "Resident of Uttar Pradesh",
        "Income certificate required",
        "Valid identity documents",
      ],
      applicationProcess: {
        type: "Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit nearest health center",
              "Fill application form",
              "Submit required documents",
              "Get health card issued",
            ],
          },
        ],
      },
      documents: [
        "Age proof certificate",
        "Address proof",
        "Income certificate",
        "Medical history (if any)",
      ],
    },
  },
  {
    id: 6,
    title: "Urban Youth Start-up Grant Scheme - Maharashtra",
    state: "Maharashtra",
    schemeType: "state",
    category: "Entrepreneurship",
    description:
      "Financial grant and mentorship support for young urban entrepreneurs to start new businesses.",
    tags: [
      "Youth",
      "Entrepreneurship",
      "Startup",
      "Grant",
      "Urban",
      "Business",
    ],
    ministry: "Department of Industries, Maharashtra",
    benefitType: "Grant",
    targetGender: "All",
    targetAge: "21-35",
    targetCaste: "All",
    residence: "Urban",
    maritalStatus: "All",
    employmentStatus: "Unemployed",
    occupation: "Entrepreneur",
    details: {
      description:
        "This scheme supports young urban residents of Maharashtra to start small-scale or micro-enterprises. It provides financial grant, business mentorship, and training sessions.",
      benefits: {
        tangible: [
          "One-time seed funding up to ₹2,00,000",
          "Free business mentorship and training for 6 months",
          "Access to co-working space for 1 year",
        ],
      },
      eligibility: [
        "Applicant must be a resident of Maharashtra (Urban area)",
        "Age between 21–35 years",
        "Should not have availed other government start-up grants",
        "Basic business plan must be submitted",
      ],
      applicationProcess: {
        type: "Online",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit Maharashtra Udyog Portal",
              "Register using Aadhaar and mobile number",
              "Upload business proposal",
              "Fill application and submit required documents",
              "Wait for verification and approval",
            ],
          },
        ],
      },
      documents: [
        "Aadhaar Card",
        "Urban Domicile Certificate",
        "Business Plan Document",
        "Bank Account Details",
        "Passport size photo",
      ],
    },
  },
  {
    id: 7,
    title: "Green Energy Subsidy for Rural Households - Rajasthan",
    state: "Rajasthan",
    schemeType: "state",
    category: "Energy",
    description:
      "This scheme offers subsidies to rural households in Rajasthan for installing solar home systems.",
    tags: [
      "Solar",
      "Rural",
      "Energy",
      "Subsidy",
      "Green Energy",
      "Environment",
    ],
    ministry: "Department of Renewable Energy, Rajasthan",
    benefitType: "Subsidy",
    targetGender: "All",
    targetAge: "All",
    targetCaste: "All",
    residence: "Rural",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Any",
    details: {
      description:
        "To promote sustainable and clean energy, this scheme offers up to 50% subsidy to rural households for solar power kits including solar panels, inverters, and batteries.",
      benefits: {
        tangible: [
          "Subsidy up to ₹30,000 per household",
          "Installation of 1kW solar panel and battery system",
          "3-year free maintenance support",
        ],
      },
      eligibility: [
        "Must be a rural resident of Rajasthan",
        "Household should not have prior solar installation",
        "Monthly household income below ₹25,000",
      ],
      applicationProcess: {
        type: "Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit the nearest Gram Panchayat office",
              "Collect and fill the Solar Subsidy Form",
              "Attach required documents and submit",
              "Wait for verification and approval",
            ],
          },
        ],
      },
      documents: [
        "Rural Address Proof",
        "Income Certificate",
        "Electricity Bill",
        "Aadhaar Card",
        "Photograph of House Rooftop",
      ],
    },
  },
  {
    id: 8,
    title: "Women's Nutrition Assistance Scheme - Kerala",
    state: "Kerala",
    schemeType: "state",
    category: "Healthcare",
    description:
      "Nutritional support for pregnant and lactating women in Kerala through monthly food kits and health supplements.",
    tags: ["Women", "Nutrition", "Healthcare", "Pregnant", "Lactating Mothers"],
    ministry: "Department of Women and Child Development, Kerala",
    benefitType: "In-kind",
    targetGender: "Female",
    targetAge: "18-45",
    targetCaste: "All",
    residence: "All",
    maritalStatus: "Married",
    employmentStatus: "All",
    occupation: "Any",
    details: {
      description:
        "This scheme aims to reduce maternal malnutrition and promote healthy pregnancy by providing nutritious food kits and supplements to women during and after pregnancy.",
      benefits: {
        tangible: [
          "Monthly nutrition kit (₹800 worth)",
          "Iron, folic acid, and calcium supplements",
          "Quarterly health check-ups",
        ],
      },
      eligibility: [
        "Must be pregnant or lactating (up to 6 months post delivery)",
        "Resident of Kerala",
        "Registered under local Anganwadi center",
      ],
      applicationProcess: {
        type: "Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit nearest Anganwadi center",
              "Register pregnancy and provide health records",
              "Submit basic ID and maternity proof",
              "Collect monthly kit after approval",
            ],
          },
        ],
      },
      documents: [
        "Aadhaar Card",
        "Maternity Health Card",
        "Doctor's certificate",
        "Address proof",
        "Ration Card (optional)",
      ],
    },
  },
  {
    id: 9,
    title: "Digital Literacy for Senior Citizens - Tamil Nadu",
    state: "Tamil Nadu",
    schemeType: "state",
    category: "Education",
    description:
      "Free digital training for senior citizens in Tamil Nadu to help them use smartphones, digital payments, and government apps.",
    tags: [
      "Senior Citizens",
      "Digital Literacy",
      "Smartphone Training",
      "Digital India",
    ],
    ministry: "Department of Social Welfare, Tamil Nadu",
    benefitType: "Training",
    targetGender: "All",
    targetAge: "60+",
    targetCaste: "All",
    residence: "All",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Retired",
    details: {
      description:
        "This scheme provides basic digital education to senior citizens to ensure they can safely use mobile phones, make UPI payments, and access government portals.",
      benefits: {
        tangible: [
          "Free 4-week digital training course",
          "Tablet provided during training (returnable)",
          "Certificate of Completion",
        ],
      },
      eligibility: [
        "Resident of Tamil Nadu",
        "Age 60 years or above",
        "Basic reading and writing ability",
      ],
      applicationProcess: {
        type: "Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit district social welfare office",
              "Fill application form for digital training",
              "Submit age and ID proof",
              "Wait for batch allotment",
            ],
          },
        ],
      },
      documents: [
        "Aadhaar Card",
        "Age Proof",
        "Passport size photo",
        "Address proof",
      ],
    },
  },
  {
    id: 10,
    title: "Eco-Friendly Farming Subsidy Scheme - Sikkim",
    state: "Sikkim",
    schemeType: "state",
    category: "Agriculture",
    description:
      "Subsidies and support for eco-friendly and organic farming practices to promote sustainable agriculture in Sikkim.",
    tags: ["Organic", "Farming", "Eco-Friendly", "Subsidy", "Sustainability"],
    ministry: "Department of Agriculture, Sikkim",
    benefitType: "Subsidy",
    targetGender: "All",
    targetAge: "18-60",
    targetCaste: "All",
    residence: "Rural",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Farmer",
    details: {
      description:
        "To maintain Sikkim’s organic farming reputation, this scheme supports farmers transitioning to organic cultivation methods by offering financial assistance and training.",
      benefits: {
        tangible: [
          "Subsidy up to 70% for compost units and organic inputs",
          "Training on eco-friendly techniques",
          "Soil testing and certification support",
        ],
      },
      eligibility: [
        "Resident of Sikkim",
        "Registered farmer",
        "Landholding below 5 hectares",
        "Willing to transition to organic farming",
      ],
      applicationProcess: {
        type: "Online/Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit nearest Agriculture Office or Sikkim Agritech portal",
              "Submit Organic Farming Application Form",
              "Attach land and farmer ID documents",
              "Undergo training before fund disbursal",
            ],
          },
        ],
      },
      documents: [
        "Farmer Registration ID",
        "Land Ownership Documents",
        "Proof of Residence",
        "Aadhaar Card",
        "Training Participation Certificate",
      ],
    },
  },
  {
    id: 11,
    title: "Eco-Friendly Farming Subsidy Scheme - Sikkim",
    state: "Sikkim",
    schemeType: "state",
    category: "Agriculture",
    description:
      "Subsidies and support for eco-friendly and organic farming practices to promote sustainable agriculture in Sikkim.",
    tags: ["Organic", "Farming", "Eco-Friendly", "Subsidy", "Sustainability"],
    ministry: "Department of Agriculture, Sikkim",
    benefitType: "Subsidy",
    targetGender: "All",
    targetAge: "18-60",
    targetCaste: "All",
    residence: "Rural",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Farmer",
    details: {
      description:
        "To maintain Sikkim’s organic farming reputation, this scheme supports farmers transitioning to organic cultivation methods by offering financial assistance and training.",
      benefits: {
        tangible: [
          "Subsidy up to 70% for compost units and organic inputs",
          "Training on eco-friendly techniques",
          "Soil testing and certification support",
        ],
      },
      eligibility: [
        "Resident of Sikkim",
        "Registered farmer",
        "Landholding below 5 hectares",
        "Willing to transition to organic farming",
      ],
      applicationProcess: {
        type: "Online/Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit nearest Agriculture Office or Sikkim Agritech portal",
              "Submit Organic Farming Application Form",
              "Attach land and farmer ID documents",
              "Undergo training before fund disbursal",
            ],
          },
        ],
      },
      documents: [
        "Farmer Registration ID",
        "Land Ownership Documents",
        "Proof of Residence",
        "Aadhaar Card",
        "Training Participation Certificate",
      ],
    },
  },
  {
    id: 12,
    title: "Eco-Friendly Farming Subsidy Scheme - Sikkim",
    state: "Sikkim",
    schemeType: "state",
    category: "Agriculture",
    description:
      "Subsidies and support for eco-friendly and organic farming practices to promote sustainable agriculture in Sikkim.",
    tags: ["Organic", "Farming", "Eco-Friendly", "Subsidy", "Sustainability"],
    ministry: "Department of Agriculture, Sikkim",
    benefitType: "Subsidy",
    targetGender: "All",
    targetAge: "18-60",
    targetCaste: "All",
    residence: "Rural",
    maritalStatus: "All",
    employmentStatus: "All",
    occupation: "Farmer",
    details: {
      description:
        "To maintain Sikkim’s organic farming reputation, this scheme supports farmers transitioning to organic cultivation methods by offering financial assistance and training.",
      benefits: {
        tangible: [
          "Subsidy up to 70% for compost units and organic inputs",
          "Training on eco-friendly techniques",
          "Soil testing and certification support",
        ],
      },
      eligibility: [
        "Resident of Sikkim",
        "Registered farmer",
        "Landholding below 5 hectares",
        "Willing to transition to organic farming",
      ],
      applicationProcess: {
        type: "Online/Offline",
        steps: [
          {
            title: "Application Process:",
            steps: [
              "Visit nearest Agriculture Office or Sikkim Agritech portal",
              "Submit Organic Farming Application Form",
              "Attach land and farmer ID documents",
              "Undergo training before fund disbursal",
            ],
          },
        ],
      },
      documents: [
        "Farmer Registration ID",
        "Land Ownership Documents",
        "Proof of Residence",
        "Aadhaar Card",
        "Training Participation Certificate",
      ],
    },
  },
];
