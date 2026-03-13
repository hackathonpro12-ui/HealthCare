changeimport { 
  Activity, Heart, Droplets, Thermometer, 
  AlertTriangle, CheckCircle, Info, TrendingUp,
  ArrowRight, Plus, History, LayoutDashboard,
  Stethoscope, User, LogOut, MapPin, Mic, MicOff,
  Shield, Zap, Bell, Phone, Star, MessageSquare,
  FileText, Calculator, Lightbulb, Globe, ChevronRight,
  Camera, Upload, Search, Pill, Sparkles, Brain
} from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  predictHealthRisks, identifyDrug, getPersonalizedTreatments,
  type HealthData, type PredictionResult, type DrugInfo, type PersonalizedTreatmentPlan 
} from './services/geminiService';
import { cn } from './lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Translations ---

const translations = {
  en: {
    appName: "HealthGuard AI",
    tagline: "AI-Powered Health Analysis",
    heroTitle: "Proactive Health Management with AI Intelligence",
    heroDesc: "Predict potential risks, monitor vital signs, and receive personalized medical recommendations backed by advanced machine learning.",
    getStarted: "Get Started Now",
    viewDashboard: "View Dashboard",
    findHospitals: "Find Nearby Hospitals",
    features: "Features",
    reviews: "Reviews",
    drugDetection: "Drug Detection",
    hospitals: "Hospitals",
    dashboard: "Dashboard",
    checkHealth: "Check Your Health",
    healthAssessment: "Health Assessment",
    vitalsAnalysis: "Enter your vitals for AI analysis",
    cancel: "Cancel",
    age: "Age",
    gender: "Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    height: "Height (cm)",
    weight: "Weight (kg)",
    bpSystolic: "BP Systolic (Upper)",
    bpDiastolic: "BP Diastolic (Lower)",
    bloodSugar: "Blood Sugar (mg/dL)",
    heartRate: "Heart Rate (bpm)",
    sleep: "Sleep (Hours/Day)",
    smoking: "I am a smoker",
    symptoms: "Symptoms",
    speakSymptoms: "Speak Symptoms",
    listening: "Listening...",
    otherSymptoms: "Other / Custom Symptoms",
    typeOther: "Type any other symptoms...",
    aiAnalyzing: "AI Analyzing...",
    analyzeHealth: "Analyze My Health",
    noData: "No Health Data Yet",
    noDataDesc: "Start your first AI-powered health checkup to see your risk analysis and trends.",
    startFirst: "Start First Checkup",
    healthMetrics: "Health Metrics Trend",
    trackingVitals: "Tracking your vitals over time",
    aiReport: "AI Health Report",
    aiHealthReport: "AI Health Report",
    personalizedRecs: "Personalized recommendations",
    personalizedRecommendations: "Personalized Recommendations",
    summary: "Summary",
    actionPlan: "Action Plan",
    downloadReport: "Download Full Report",
    successChance: "Success Chance",
    readyToAnalyze: "Ready to Analyze",
    dailyTip: "Daily Health Tip",
    leaveReview: "Leave a Review",
    shareThoughts: "Share your thoughts with us",
    yourName: "Your Name",
    rating: "Rating",
    comment: "Comment",
    submitFeedback: "Submit Feedback",
    communityFeedback: "Community Feedback",
    noReviews: "No reviews yet. Be the first to share!",
    drugDetectionTitle: "AI Drug Detection",
    drugDetectionDesc: "Identify medicines instantly using AI vision",
    uploadMedicine: "Upload Medicine Photo",
    clickOrDrag: "Click or drag to upload",
    supportsJpg: "Supports JPG, PNG (Max 5MB)",
    identifyMedicine: "Identify Medicine",
    analyzingMedicine: "Analyzing Medicine...",
    drugInfo: "Drug Information",
    manufacturer: "Manufacturer",
    typicalDosage: "Typical Dosage",
    commonUses: "Common Uses",
    sideEffects: "Side Effects",
    importantWarnings: "Important Warnings",
    healthOverview: "Health Overview",
    welcomeBack: "Welcome back. Here's your latest health analysis.",
    lastUpdated: "Last updated",
    emergencyAlert: "Emergency Risk Alert",
    critical: "CRITICAL",
    emergencyRiskDesc: "The AI engine has detected a possible severe health event (e.g., heart attack or stroke risk). Immediate action is required.",
    nearestER: "Nearest Emergency Room",
    callFamily: "Call Family Contact",
    alertDoctor: "Alert Local Doctor",
    aiHealthScore: "AI Health Score",
    outOf100: "Out of 100",
    condition: "Condition",
    basedOnVitals: "Based on your latest vitals and symptoms",
    bloodPressure: "Blood Pressure",
    bmiIndex: "BMI Index",
    checkupDate: "Checkup Date",
    latest: "Latest",
    diabetesRisk: "Diabetes Risk",
    heartRisk: "Heart Risk",
    hypertension: "Hypertension",
    kidneyRisk: "Kidney Risk",
    history: "Checkup History",
    refresh: "Refresh",
    recentReports: "Recent Reports",
    viewAll: "View All",
    treatmentSystem: "Personalized Treatment System",
    predictSuccess: "Predict Treatment Success",
    analyzePatientData: "Analyze Patient-Specific Data",
    getRecommendations: "Get Personalized Recommendations",
    successProbability: "Success Probability",
    treatmentReasoning: "Reasoning",
    patientAnalysis: "Patient Analysis",
    symptomCategories: {
      general: "General",
      respiratory: "Respiratory",
      cardio: "Cardiovascular",
      digestive: "Digestive",
      neuro: "Neurological",
      musculo: "Musculoskeletal",
      others: "Others"
    }
  },
  hi: {
    appName: "हेल्थगार्ड AI",
    tagline: "AI-संचालित स्वास्थ्य विश्लेषण",
    heroTitle: "AI इंटेलिजेंस के साथ सक्रिय स्वास्थ्य प्रबंधन",
    heroDesc: "संभावित जोखिमों की भविष्यवाणी करें, महत्वपूर्ण संकेतों की निगरानी करें, और उन्नत मशीन लर्निंग द्वारा समर्थित व्यक्तिगत चिकित्सा सिफारिशें प्राप्त करें।",
    getStarted: "अभी शुरू करें",
    viewDashboard: "डैशबोर्ड देखें",
    findHospitals: "पास के अस्पताल खोजें",
    features: "विशेषताएं",
    reviews: "समीक्षाएं",
    drugDetection: "दवा की पहचान",
    hospitals: "अस्पताल",
    dashboard: "डैशबोर्ड",
    checkHealth: "अपना स्वास्थ्य जांचें",
    healthAssessment: "स्वास्थ्य मूल्यांकन",
    vitalsAnalysis: "AI विश्लेषण के लिए अपने महत्वपूर्ण संकेत दर्ज करें",
    cancel: "रद्द करें",
    age: "आयु",
    gender: "लिंग",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    height: "ऊंचाई (सेमी)",
    weight: "वजन (किग्रा)",
    bpSystolic: "बीपी सिस्टोलिक (ऊपरी)",
    bpDiastolic: "बीपी डायस्टोलिक (निचला)",
    bloodSugar: "ब्लड शुगर (mg/dL)",
    heartRate: "हृदय गति (bpm)",
    sleep: "नींद (घंटे/दिन)",
    smoking: "मैं धूम्रपान करता हूँ",
    symptoms: "लक्षण",
    speakSymptoms: "लक्षण बोलें",
    listening: "सुन रहा हूँ...",
    otherSymptoms: "अन्य / कस्टम लक्षण",
    typeOther: "कोई अन्य लक्षण टाइप करें...",
    aiAnalyzing: "AI विश्लेषण कर रहा है...",
    analyzeHealth: "मेरे स्वास्थ्य का विश्लेषण करें",
    noData: "अभी तक कोई स्वास्थ्य डेटा नहीं है",
    noDataDesc: "अपने जोखिम विश्लेषण और रुझान देखने के लिए अपना पहला AI-संचालित स्वास्थ्य चेकअप शुरू करें।",
    startFirst: "पहला चेकअप शुरू करें",
    healthMetrics: "स्वास्थ्य मेट्रिक्स रुझान",
    trackingVitals: "समय के साथ आपके महत्वपूर्ण संकेतों की ट्रैकिंग",
    aiReport: "AI स्वास्थ्य रिपोर्ट",
    aiHealthReport: "AI स्वास्थ्य रिपोर्ट",
    personalizedRecs: "व्यक्तिगत सिफारिशें",
    personalizedRecommendations: "व्यक्तिगत सिफारिशें",
    summary: "सारांश",
    actionPlan: "कार्य योजना",
    downloadReport: "पूरी रिपोर्ट डाउनलोड करें",
    successChance: "सफलता की संभावना",
    readyToAnalyze: "विश्लेषण के लिए तैयार",
    dailyTip: "दैनिक स्वास्थ्य टिप",
    leaveReview: "समीक्षा छोड़ें",
    shareThoughts: "अपने विचार हमारे साथ साझा करें",
    yourName: "आपका नाम",
    rating: "रेटिंग",
    comment: "टिप्पणी",
    submitFeedback: "फीडबैक सबमिट करें",
    communityFeedback: "सामुदायिक फीडबैक",
    noReviews: "अभी तक कोई समीक्षा नहीं। साझा करने वाले पहले व्यक्ति बनें!",
    drugDetectionTitle: "AI दवा पहचान",
    drugDetectionDesc: "AI विजन का उपयोग करके दवाओं की तुरंत पहचान करें",
    uploadMedicine: "दवा का फोटो अपलोड करें",
    clickOrDrag: "अपलोड करने के लिए क्लिक करें या खींचें",
    supportsJpg: "JPG, PNG का समर्थन करता है (अधिकतम 5MB)",
    identifyMedicine: "दवा की पहचान करें",
    analyzingMedicine: "दवा का विश्लेषण कर रहा है...",
    drugInfo: "दवा की जानकारी",
    manufacturer: "निर्माता",
    typicalDosage: "सामान्य खुराक",
    commonUses: "सामान्य उपयोग",
    sideEffects: "दुष्प्रभाव",
    importantWarnings: "महत्वपूर्ण चेतावनियाँ",
    healthOverview: "स्वास्थ्य अवलोकन",
    welcomeBack: "वापसी पर स्वागत है। यहाँ आपका नवीनतम स्वास्थ्य विश्लेषण है।",
    lastUpdated: "अंतिम अपडेट",
    emergencyAlert: "आपातकालीन जोखिम चेतावनी",
    critical: "गंभीर",
    emergencyRiskDesc: "AI इंजन ने एक संभावित गंभीर स्वास्थ्य घटना (जैसे, दिल का दौरा या स्ट्रोक का जोखिम) का पता लगाया है। तत्काल कार्रवाई की आवश्यकता है।",
    nearestER: "निकટतम आपातकालीन कक्ष",
    callFamily: "पारिवारिक संपर्क को कॉल करें",
    alertDoctor: "स्थानीय डॉक्टर को सूचित करें",
    aiHealthScore: "AI स्वास्थ्य स्कोर",
    outOf100: "100 में से",
    condition: "स्थिति",
    basedOnVitals: "आपके नवीनतम महत्वपूर्ण संकेतों और लक्षणों के आधार पर",
    bloodPressure: "रक्तचाप",
    bmiIndex: "BMI सूचकांक",
    checkupDate: "चेकअप की तारीख",
    latest: "नवीनतम",
    diabetesRisk: "मधुमेह का जोखिम",
    heartRisk: "हृदय जोखिम",
    hypertension: "उच्च रक्तचाप",
    kidneyRisk: "गुर्दे का जोखिम",
    history: "चेकअप इतिहास",
    refresh: "रिफ्रेश करें",
    recentReports: "हालिया रिपोर्ट",
    viewAll: "सभी देखें",
    treatmentSystem: "व्यक्तिगत उपचार प्रणाली",
    predictSuccess: "उपचार की सफलता की भविष्यवाणी",
    analyzePatientData: "रोगी-विशिष्ट डेटा का विश्लेषण",
    getRecommendations: "व्यक्तिगत सिफारिशें प्राप्त करें",
    successProbability: "सफलता की संभावना",
    treatmentReasoning: "तर्क",
    patientAnalysis: "रोगी विश्लेषण",
    symptomCategories: {
      general: "सामान्य",
      respiratory: "श्वसन",
      cardio: "हृदय",
      digestive: "पाचन",
      neuro: "तंत्रिका संबंधी",
      musculo: "मांसपेशियों",
      others: "अन्य"
    }
  },
  gu: {
    appName: "હેલ્થગાર્ડ AI",
    tagline: "AI-સંચાલિત આરોગ્ય વિશ્લેષણ",
    heroTitle: "AI ઇન્ટેલિજન્સ સાથે સક્રિય આરોગ્ય સંચાલન",
    heroDesc: "સંભવિત જોખમોની આગાહી કરો, મહત્વપૂર્ણ સંકેતોનું નિરીક્ષણ કરો અને અદ્યતન મશીન લર્નિંગ દ્વારા સમર્થિત વ્યક્તિગત તબીબી ભલામણો મેળવો.",
    getStarted: "હમણાં શરૂ કરો",
    viewDashboard: "ડેશબોર્ડ જુઓ",
    findHospitals: "નજીકની હોસ્પિટલો શોધો",
    features: "વિશેષતાઓ",
    reviews: "સમીક્ષાઓ",
    drugDetection: "દવાની ઓળખ",
    hospitals: "હોસ્પિટલો",
    dashboard: "ડેશબોર્ડ",
    checkHealth: "તમારું સ્વાસ્થ્ય તપાસો",
    healthAssessment: "આરોગ્ય મૂલ્યાંકન",
    vitalsAnalysis: "AI વિશ્લેષણ માટે તમારા મહત્વપૂર્ણ સંકેતો દાખલ કરો",
    cancel: "રદ કરો",
    age: "ઉંમર",
    gender: "લિંગ",
    male: "પુરુષ",
    female: "સ્ત્રી",
    other: "અન્ય",
    height: "ઊંચાઈ (સેમી)",
    weight: "વજન (કિલો)",
    bpSystolic: "બીપી સિસ્ટોલિક (ઉપરનું)",
    bpDiastolic: "બીપી ડાયસ્ટોલિક (નીચેનું)",
    bloodSugar: "બ્લડ સુગર (mg/dL)",
    heartRate: "હૃદયના ધબકારા (bpm)",
    sleep: "ઊંઘ (કલાક/દિવસ)",
    smoking: "હું ધૂમ્રપાન કરું છું",
    symptoms: "લક્ષણો",
    speakSymptoms: "લક્ષણો બોલો",
    listening: "સાંભળી રહ્યો છું...",
    otherSymptoms: "અન્ય / કસ્ટમ લક્ષણો",
    typeOther: "કોઈપણ અન્ય લક્ષણો ટાઇપ કરો...",
    aiAnalyzing: "AI વિશ્લેષણ કરી રહ્યું છે...",
    analyzeHealth: "મારા સ્વાસ્થ્યનું વિશ્લેષણ કરો",
    noData: "હજુ સુધી કોઈ આરોગ્ય ડેટા નથી",
    noDataDesc: "તમારા જોખમ વિશ્લેષણ અને વલણો જોવા માટે તમારું પ્રથમ AI-સંચાલિત આરોગ્ય ચેકઅપ શરૂ કરો.",
    startFirst: "પ્રથમ ચેકઅપ શરૂ કરો",
    healthMetrics: "આરોગ્ય મેટ્રિક્સ વલણ",
    trackingVitals: "સમય જતાં તમારા મહત્વપૂર્ણ સંકેતોનું ટ્રેકિંગ",
    aiReport: "AI આરોગ્ય અહેવાલ",
    aiHealthReport: "AI આરોગ્ય અહેવાલ",
    personalizedRecs: "વ્યક્તિગત ભલામણો",
    personalizedRecommendations: "વ્યક્તિગત ભલામણો",
    summary: "સારાંશ",
    actionPlan: "કાર્ય યોજના",
    downloadReport: "સંપૂર્ણ અહેવાલ ડાઉનલોડ કરો",
    successChance: "સફળતાની શક્યતા",
    readyToAnalyze: "વિશ્લેષણ માટે તૈયાર",
    dailyTip: "દૈનિક આરોગ્ય ટિપ",
    leaveReview: "સમીક્ષા લખો",
    shareThoughts: "તમારા વિચારો અમારી સાથે શેર કરો",
    yourName: "તમારું નામ",
    rating: "રેટિંગ",
    comment: "ટિપ્પણી",
    submitFeedback: "ફીડબેક સબમિટ કરો",
    communityFeedback: "સામુદાયિક ફીડબેક",
    noReviews: "હજુ સુધી કોઈ સમીક્ષાઓ નથી. શેર કરનાર પ્રથમ બનો!",
    drugDetectionTitle: "AI દવાની ઓળખ",
    drugDetectionDesc: "AI વિઝનનો ઉપયોગ કરીને તરત જ દવાઓ ઓળખો",
    uploadMedicine: "દવાનો ફોટો અપલોડ કરો",
    clickOrDrag: "અપલોડ કરવા માટે ક્લિક કરો અથવા ખેંચો",
    supportsJpg: "JPG, PNG સપોર્ટ કરે છે (મહત્તમ 5MB)",
    identifyMedicine: "દવા ઓળખો",
    analyzingMedicine: "દવાનું વિશ્લેષણ કરી રહ્યું છે...",
    drugInfo: "દવાની માહિતી",
    manufacturer: "ઉત્પાદક",
    typicalDosage: "સામાન્ય માત્રા",
    commonUses: "સામાન્ય ઉપયોગો",
    sideEffects: "આડઅસરો",
    importantWarnings: "મહત્વપૂર્ણ ચેતવણીઓ",
    healthOverview: "આરોગ્ય વિહંગાવલોકન",
    welcomeBack: "સ્વાગત છે. અહીં તમારું નવીનતમ આરોગ્ય વિશ્લેષણ છે.",
    lastUpdated: "છેલ્લે અપડેટ કરેલ",
    emergencyAlert: "કટોકટી જોખમ ચેતવણી",
    critical: "ગંભીર",
    emergencyRiskDesc: "AI એન્જિને સંભવિત ગંભીર સ્વાસ્થ્ય ઘટના (દા.ત., હાર્ટ એટેક અથવા સ્ટ્રોકનું જોખમ) શોધી કાઢ્યું છે. તાત્કાલિક પગલાં લેવા જરૂરી છે.",
    nearestER: "નજીકનું ઇમરજન્સી રૂમ",
    callFamily: "કૌટુંબિક સંપર્કને કૉલ કરો",
    alertDoctor: "સ્થાનિક ડૉક્ટરને એલર્ટ કરો",
    aiHealthScore: "AI હેલ્થ સ્કોર",
    outOf100: "100 માંથી",
    condition: "સ્થિતિ",
    basedOnVitals: "તમારા નવીનતમ મહત્વપૂર્ણ સંકેતો અને લક્ષણો પર આધારિત",
    bloodPressure: "બ્લડ પ્રેશર",
    bmiIndex: "BMI ઇન્ડેક્સ",
    checkupDate: "ચેકઅપ તારીખ",
    latest: "નવીનતમ",
    diabetesRisk: "ડાયાબિટીસ જોખમ",
    heartRisk: "હૃદયનું જોખમ",
    hypertension: "હાયપરટેન્શન",
    kidneyRisk: "કિડનીનું જોખમ",
    history: "ચેકઅપ ઇતિહાસ",
    refresh: "રિફ્રેશ કરો",
    recentReports: "તાજેતરના અહેવાલો",
    viewAll: "બધું જુઓ",
    treatmentSystem: "વ્યક્તિગત સારવાર પ્રણાલી",
    predictSuccess: "સારવારની સફળતાની આગાહી",
    analyzePatientData: "દર્દી-વિશિષ્ટ ડેટાનું વિશ્લેષણ",
    getRecommendations: "વ્યક્તિગત ભલામણો મેળવો",
    successProbability: "સફળતાની સંભાવના",
    treatmentReasoning: "તર્ક",
    patientAnalysis: "દર્દી વિશ્લેષણ",
    symptomCategories: {
      general: "સામાન્ય",
      respiratory: "શ્વસન",
      cardio: "હૃદય",
      digestive: "પાચન",
      neuro: "ચેતાતંત્ર",
      musculo: "સ્નાયુબદ્ધ",
      others: "અન્ય"
    }
  }
};

const symptomOptions = [
  { id: "fatigue", label: { en: "Fatigue", hi: "थकान", gu: "થાક" }, category: "general" },
  { id: "fever", label: { en: "Fever", hi: "बुखार", gu: "તાવ" }, category: "general" },
  { id: "dizziness", label: { en: "Dizziness", hi: "चक्कर आना", gu: "ચક્કર આવવા" }, category: "general" },
  { id: "weight_loss", label: { en: "Weight Loss", hi: "वजन कम होना", gu: "વજન ઘટવું" }, category: "general" },
  { id: "weight_gain", label: { en: "Weight Gain", hi: "वजन बढ़ना", gu: "વજન વધવું" }, category: "general" },
  
  { id: "cough", label: { en: "Cough", hi: "खांसी", gu: "ખાંસી" }, category: "respiratory" },
  { id: "shortness_of_breath", label: { en: "Shortness of Breath", hi: "सांस की तकलीफ", gu: "શ્વાસ લેવામાં તકલીફ" }, category: "respiratory" },
  { id: "sore_throat", label: { en: "Sore Throat", hi: "गले में खराश", gu: "ગળામાં દુખાવો" }, category: "respiratory" },
  { id: "wheezing", label: { en: "Wheezing", hi: "घरघराहट", gu: "ઘરઘરાટી" }, category: "respiratory" },
  
  { id: "chest_pain", label: { en: "Chest Pain", hi: "सीने में दर्द", gu: "છાતીમાં દુખાવો" }, category: "cardio" },
  { id: "palpitations", label: { en: "Palpitations", hi: "धड़कन", gu: "ધબકારા વધવા" }, category: "cardio" },
  { id: "swelling_legs", label: { en: "Swelling in Legs", hi: "पैरों में सूजन", gu: "પગમાં સોજો" }, category: "cardio" },
  
  { id: "nausea", label: { en: "Nausea", hi: "जी मिचलाना", gu: "ઉબકા" }, category: "digestive" },
  { id: "vomiting", label: { en: "Vomiting", hi: "उल्टी", gu: "ઊલટી" }, category: "digestive" },
  { id: "diarrhea", label: { en: "Diarrhea", hi: "दस्त", gu: "ઝાડા" }, category: "digestive" },
  { id: "constipation", label: { en: "Constipation", hi: "कब्ज", gu: "કબજિયાત" }, category: "digestive" },
  { id: "abdominal_pain", label: { en: "Abdominal Pain", hi: "पेट दर्द", gu: "પેટમાં દુખાવો" }, category: "digestive" },
  
  { id: "headache", label: { en: "Headache", hi: "सिरदर्द", gu: "માથાનો દુખાવો" }, category: "neuro" },
  { id: "numbness", label: { en: "Numbness", hi: "सुन्न होना", gu: "શૂન્યતા" }, category: "neuro" },
  { id: "confusion", label: { en: "Confusion", hi: "भ्रम", gu: "ગૂંચવણ" }, category: "neuro" },
  { id: "seizures", label: { en: "Seizures", hi: "दौरे", gu: "ખેંચ" }, category: "neuro" },
  
  { id: "joint_pain", label: { en: "Joint Pain", hi: "जोड़ों का दर्द", gu: "સાંધાનો દુખાવો" }, category: "musculo" },
  { id: "muscle_aches", label: { en: "Muscle Aches", hi: "मांसपेशियों में दर्द", gu: "સ્નાયુમાં દુખાવો" }, category: "musculo" },
  { id: "back_pain", label: { en: "Back Pain", hi: "पीठ दर्द", gu: "કમરનો દુખાવો" }, category: "musculo" },
  
  { id: "loss_taste_smell", label: { en: "Loss of Taste/Smell", hi: "स्वाद/गंध की कमी", gu: "સ્વાદ/ગંધ ગુમાવવી" }, category: "others" },
  { id: "skin_rash", label: { en: "Skin Rash", hi: "त्वचा पर चकत्ते", gu: "ત્વચા પર ફોલ્લીઓ" }, category: "others" },
  { id: "itching", label: { en: "Itching", hi: "खुजली", gu: "ખંજવાળ" }, category: "others" },
];

// --- Types ---

interface HealthRecord extends HealthData {
  id: number;
  createdAt: string;
  predictionData: PredictionResult;
}

// --- Components ---

const Card = ({ children, className, hover = true, onClick }: { children: React.ReactNode; className?: string; hover?: boolean; onClick?: () => void }) => (
  <motion.div 
    whileHover={hover ? { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
    className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-shadow", className)}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  disabled,
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const variants = {
    primary: "bg-[#E91E63] text-white hover:bg-[#D81B60]",
    secondary: "bg-slate-900 text-white hover:bg-slate-800",
    outline: "bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        className
      )}
    >
      {children}
    </motion.button>
  );
};

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <input 
      {...props}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
    />
  </div>
);

const Select = ({ label, options, ...props }: { label: string, options: { label: string, value: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-slate-700">{label}</label>
    <select 
      {...props}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
    >
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = React.useState<'landing' | 'dashboard' | 'form' | 'history' | 'drug-detection'>('landing');
  const [lang, setLang] = React.useState<'en' | 'hi' | 'gu'>('en');
  const t = translations[lang];
  const [records, setRecords] = React.useState<HealthRecord[]>([]);
  const [reviews, setReviews] = React.useState<{id: number, name: string, rating: number, comment: string}[]>([
    {
      "id": 1,
      "name": "Rohan",
      "rating": 5,
      "comment": "This app is a lifesaver! The AI analysis is incredibly accurate and has helped me stay on top of my health."
    },
    {
      "id": 2,
      "name": "Priya",
      "rating": 4,
      "comment": "I love the personalized recommendations. It's like having a personal health assistant in your pocket."
    },
    {
      "id": 3,
      "name": "Amit",
      "rating": 5,
      "comment": "The drug detection feature is amazing. It correctly identified my medication and provided useful information."
    }
  ]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  // Drug Detection State
  const [drugImage, setDrugImage] = React.useState<string | null>(null);
  const [drugInfo, setDrugInfo] = React.useState<DrugInfo | null>(null);
  const [analyzingDrug, setAnalyzingDrug] = React.useState(false);
  const [treatmentPlan, setTreatmentPlan] = React.useState<PersonalizedTreatmentPlan | null>(null);
  const [analyzingTreatments, setAnalyzingTreatments] = React.useState(false);

  // BMI State
  const [bmiData, setBmiData] = React.useState({ height: '', weight: '' });
  const [bmiResult, setBmiResult] = React.useState<number | null>(null);

  // Review Form State
  const [reviewForm, setReviewForm] = React.useState({ name: '', rating: 0, comment: '' });

  // Daily Tip
  const healthTips = [
    "Practice mindfulness or meditation for 5-10 minutes a day to reduce stress.",
    "Drink at least 8 glasses of water daily to stay hydrated.",
    "Try to get at least 7-8 hours of quality sleep every night.",
    "Incorporate more leafy greens and colorful vegetables into your meals.",
    "Take a 15-minute walk after lunch to boost your metabolism."
  ];
  const [dailyTip] = React.useState(healthTips[Math.floor(Math.random() * healthTips.length)]);

  // Form State
  const [formData, setFormData] = React.useState<HealthData>({
    age: 30,
    gender: 'male',
    height: 175,
    weight: 70,
    bloodPressureSystolic: 120,
    bloodPressureDiastolic: 80,
    bloodSugar: 90,
    heartRate: 72,
    sleepHours: 7,
    isSmoking: false,
    exerciseFrequency: 'moderate',
    symptoms: ''
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.rating || !reviewForm.comment) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        setReviewForm({ name: '', rating: 0, comment: '' });
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const calculateBMI = () => {
    const h = parseFloat(bmiData.height) / 100;
    const w = parseFloat(bmiData.weight);
    if (h > 0 && w > 0) {
      setBmiResult(parseFloat((w / (h * h)).toFixed(1)));
    }
  };

  const findHospitals = () => {
    window.open("https://www.google.com/maps/search/hospitals+near+me", "_blank");
  };

  const downloadReport = () => {
    window.print();
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({ ...prev, symptoms: prev.symptoms ? prev.symptoms + " " + transcript : transcript }));
    };

    recognition.start();
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-500";
    if (score >= 70) return "text-blue-500";
    if (score >= 50) return "text-orange-500";
    return "text-red-500";
  };

  const getHealthCondition = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Risk";
    return "Critical";
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/records');
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecords();
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // 1. Get AI Prediction
      const prediction = await predictHealthRisks(formData);
      
      // 2. Save to DB
      const res = await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, predictionData: prediction })
      });
      
      if (res.ok) {
        await fetchRecords();
        setView('dashboard');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process health data. Please check your API key.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrugUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDrugImage(reader.result as string);
        setDrugInfo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeDrugImage = async () => {
    if (!drugImage) return;
    setAnalyzingDrug(true);
    try {
      const base64 = drugImage.split(',')[1];
      const info = await identifyDrug(base64);
      setDrugInfo(info);
    } catch (err) {
      console.error(err);
      alert("Failed to identify drug. Please ensure the image is clear.");
    } finally {
      setAnalyzingDrug(false);
    }
  };

  const handleGetTreatments = async () => {
    const latestRecord = records[0];
    if (!latestRecord) return;
    
    setAnalyzingTreatments(true);
    try {
      const plan = await getPersonalizedTreatments(latestRecord);
      setTreatmentPlan(plan);
    } catch (err) {
      console.error(err);
      alert("Failed to generate treatment plan.");
    } finally {
      setAnalyzingTreatments(false);
    }
  };

  const latestRecord = records[0];

  return (
    <div className="min-h-screen bg-[#F9A8C9] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F9A8C9]/80 backdrop-blur-md border-b border-pink-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg bg-[#E91E63]">
              <Activity size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight">{t.appName}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('landing')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">{t.features}</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('landing')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">{t.reviews}</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('drug-detection')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">{t.drugDetection}</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={findHospitals} className="text-sm font-medium hover:text-[#E91E63] transition-colors">{t.hospitals}</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('dashboard')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">{t.dashboard}</motion.button>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setView('form')} className="flex items-center gap-2 bg-[#E91E63] hover:bg-[#D81B60]">
              <Plus size={18} />
              <span className="hidden sm:inline">{t.checkHealth}</span>
            </Button>
            <div className="flex items-center gap-1 bg-white/30 p-1 rounded-xl border border-white/20">
              {(['en', 'hi', 'gu'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn(
                    "px-2 py-1 rounded-lg text-xs font-bold transition-all",
                    lang === l ? "bg-[#E91E63] text-white shadow-sm" : "text-slate-700 hover:bg-white/20"
                  )}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className={cn(view === 'landing' ? "" : "max-w-7xl mx-auto px-4 py-8")}>
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-24 pb-24"
            >
              {/* Hero Section */}
              <section className="max-w-7xl mx-auto px-4 pt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-[#E91E63] text-xs font-bold uppercase tracking-wider">
                    <TrendingUp size={14} />
                    {t.tagline}
                  </div>
                  <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
                    {t.heroTitle}
                  </h1>
                  <p className="text-xl text-slate-700 max-w-lg leading-relaxed">
                    {t.heroDesc}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setView('form')} className="bg-[#E91E63] hover:bg-[#D81B60] px-8 py-4 text-lg rounded-2xl flex items-center gap-2">
                      {t.getStarted}
                      <ArrowRight size={20} />
                    </Button>
                    <Button variant="outline" onClick={() => setView('dashboard')} className="bg-white/50 border-pink-200 hover:bg-white px-8 py-4 text-lg rounded-2xl">
                      {t.viewDashboard}
                    </Button>
                    <Button variant="outline" onClick={findHospitals} className="bg-white/50 border-pink-200 hover:bg-white px-8 py-4 text-lg rounded-2xl flex items-center gap-2">
                      <MapPin size={20} />
                      {t.findHospitals}
                    </Button>
                  </div>
                </div>
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-[40px] overflow-hidden shadow-2xl shadow-pink-500/20"
                  >
                    <img 
                      src="https://miro.medium.com/v2/resize:fit:720/format:webp/0*3UEGeXFnwXJ9-QJG.png" 
                      alt="AI Health Analysis" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {/* Overlay simulation of the UI in the image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
                      <div className="backdrop-blur-md bg-white/10 p-6 rounded-3xl border border-white/20">
                        <h3 className="text-2xl font-bold mb-2">Predictive Analytics</h3>
                        <p className="text-sm text-white/80">Unusual mental health patterns detected. Suggesting stress relief protocols.</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </section>

              {/* Features Section */}
              <section className="max-w-7xl mx-auto px-4 space-y-16">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black text-slate-900">Comprehensive Health Guard</h2>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto">Our advanced intelligent systems work in harmony to provide a 360-degree view of your health and protect your future.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {[
                    { 
                      title: "AI Disease Prediction System", 
                      desc: "Our core diagnostic engine analyzes complex datasets including age, weight, blood pressure, and biological markers to predict potential chronic conditions.",
                      icon: Activity,
                      tags: ["Early Diabetes Detection", "Heart Disease Identification", "Hypertension Risk Mapping", "Kidney Condition Warnings"]
                    },
                    { 
                      title: "Digital Health Report PDF", 
                      desc: "After each AI analysis, the system generates a comprehensive yet easy-to-understand health report. You can download this report as a PDF to keep for your records or share with your doctor.",
                      icon: FileText,
                      tags: ["Downloadable PDF Format", "Includes Health Score", "Detailed Risk Analysis", "Personalized Recommendations"]
                    },
                    { 
                      title: "AI Health Score & Dashboard", 
                      desc: "Visualize your long-term health journey with a unified Health Score that translates complex vitals into an easy-to-understand metric.",
                      icon: LayoutDashboard,
                      tags: ["Unified Score (0-100)", "Interactive Trend Charts", "Lifestyle Impact Analysis", "Weekly Progress Reports"]
                    },
                    { 
                      title: "BMI Calculator", 
                      desc: "Easily calculate your Body Mass Index (BMI) to understand if you are in a healthy weight range. This simple tool helps you monitor a key indicator of your overall health.",
                      icon: Calculator,
                      tags: ["Instant BMI Calculation", "Health Category Analysis", "Uses Standard Formula", "Simple Height & Weight Input"]
                    },
                    { 
                      title: "Daily Health Tips", 
                      desc: "Receive a new, actionable health tip every day to help you build and maintain healthy habits. These small, consistent steps can lead to significant long-term health improvements.",
                      icon: Lightbulb,
                      tags: ["New Tip Every 24 Hours", "Covers Diet & Wellness", "Easy to Understand", "Promotes Healthy Living"]
                    },
                    { 
                      title: "Emergency Risk Alert System", 
                      desc: "Our high-priority monitoring system detects life-threatening patterns and triggers immediate response protocols to save lives.",
                      icon: AlertTriangle,
                      tags: ["Critical Risk Triggers", "Automated Hospital Routes", "Emergency Contact Alerts", "Urgent Test Scheduling"]
                    }
                  ].map((feature, idx) => (
                    <Card key={idx} className="p-8 flex flex-col md:flex-row gap-8 items-start" hover={true}>
                      <div className="w-14 h-14 rounded-2xl bg-pink-50 flex items-center justify-center text-[#E91E63] shrink-0">
                        <feature.icon size={32} />
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 w-full md:w-auto">
                        {feature.tags.map((tag, i) => (
                          <div key={i} className="flex items-center gap-2 px-4 py-2 bg-pink-50/50 rounded-full border border-pink-100 text-sm font-medium text-slate-700">
                            <CheckCircle size={14} className="text-[#E91E63]" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Toolkit Section */}
              <section className="max-w-7xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-black text-slate-900">Your Daily Health Toolkit</h2>
                  <p className="text-xl text-slate-600">Simple tools and tips to help you stay on top of your health every day.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* BMI Calculator */}
                  <Card className="p-8 space-y-6">
                    <div className="flex items-center gap-3">
                      <Calculator className="text-[#E91E63]" size={28} />
                      <h3 className="text-2xl font-bold">BMI Calculator</h3>
                    </div>
                    <p className="text-slate-500">Calculate your Body Mass Index (BMI).</p>
                    <div className="space-y-4">
                      <Input 
                        label="Height (cm)" 
                        placeholder="e.g., 175" 
                        value={bmiData.height}
                        onChange={e => setBmiData({...bmiData, height: e.target.value})}
                      />
                      <Input 
                        label="Weight (kg)" 
                        placeholder="e.g., 70" 
                        value={bmiData.weight}
                        onChange={e => setBmiData({...bmiData, weight: e.target.value})}
                      />
                      <Button onClick={calculateBMI} className="w-full bg-[#E91E63] hover:bg-[#D81B60] py-4">Calculate BMI</Button>
                      {bmiResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-4 bg-pink-50 rounded-xl border border-pink-100 text-center"
                        >
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Your BMI</p>
                          <p className="text-4xl font-black text-[#E91E63]">{bmiResult}</p>
                          <p className="text-sm font-bold text-slate-700 mt-1">
                            {bmiResult < 18.5 ? "Underweight" : bmiResult < 25 ? "Normal weight" : bmiResult < 30 ? "Overweight" : "Obese"}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </Card>

                  {/* Daily Tip */}
                  <Card className="p-8 space-y-6 bg-pink-200/50 border-pink-300">
                    <div className="flex items-center gap-3">
                      <Lightbulb className="text-[#E91E63]" size={28} />
                      <h3 className="text-2xl font-bold">Daily Health Tip</h3>
                    </div>
                    <div className="h-full flex items-center justify-center py-12">
                      <p className="text-2xl font-medium text-slate-800 text-center leading-relaxed italic">
                        "{dailyTip}"
                      </p>
                    </div>
                  </Card>
                </div>
              </section>

              {/* Reviews Section */}
              <section className="max-w-7xl mx-auto px-4 space-y-12">
                <div className="text-center space-y-4">
                  <div className="inline-block px-4 py-1 bg-white rounded-lg text-xs font-bold uppercase tracking-widest text-slate-500 shadow-sm">Feedback</div>
                  <h2 className="text-5xl font-black text-slate-900">User Reviews & Ratings</h2>
                  <p className="text-xl text-slate-600">See what our community thinks about HealthGuard AI and share your own experience.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Leave a Review */}
                  <Card className="p-8 space-y-6">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold">Leave a Review</h3>
                      <p className="text-slate-500">Share your thoughts with us</p>
                    </div>
                    <form onSubmit={submitReview} className="space-y-4">
                      <Input 
                        label="Your Name" 
                        placeholder="e.g., Jane Doe" 
                        value={reviewForm.name}
                        onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      />
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <motion.button 
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.8 }}
                              key={star} 
                              type="button"
                              onClick={() => setReviewForm({...reviewForm, rating: star})}
                              className={cn("transition-colors", reviewForm.rating >= star ? "text-yellow-400" : "text-slate-200")}
                            >
                              <Star size={24} fill={reviewForm.rating >= star ? "currentColor" : "none"} />
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700">Comment</label>
                        <textarea 
                          className="w-full px-4 py-2.5 bg-pink-50 border border-pink-100 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all min-h-[100px]"
                          placeholder="What do you think about HealthGuard AI?"
                          value={reviewForm.comment}
                          onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#E91E63] hover:bg-[#D81B60] py-4">Submit Feedback</Button>
                    </form>
                  </Card>

                  {/* Community Feedback */}
                  <Card className="p-8 space-y-6">
                    <h3 className="text-2xl font-bold">Community Feedback</h3>
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                      {reviews.length > 0 ? reviews.map((review) => (
                        <div key={review.id} className="p-4 bg-pink-50 rounded-2xl border border-pink-100 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-900">{review.name}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map(star => (
                                <Star key={star} size={12} className={review.rating >= star ? "text-yellow-400" : "text-slate-200"} fill={review.rating >= star ? "currentColor" : "none"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      )) : (
                        <div className="text-center py-12 text-slate-400">
                          <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                          <p>No reviews yet. Be the first to share!</p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'drug-detection' && (
            <motion.div
              key="drug-detection"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900">AI Drug Identification</h2>
                <p className="text-slate-600">Upload a photo of your medicine to get detailed information instantly.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <Camera className="text-[#E91E63]" size={28} />
                    <h3 className="text-2xl font-bold">{t.uploadMedicine}</h3>
                  </div>
                  
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleDrugUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 flex flex-col items-center justify-center gap-4 group-hover:bg-pink-100 transition-colors overflow-hidden">
                      {drugImage ? (
                        <img src={drugImage} alt="Drug Preview" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#E91E63] shadow-sm">
                            <Upload size={32} />
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-slate-700">{t.clickOrDrag}</p>
                            <p className="text-xs text-slate-400">{t.supportsJpg}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={analyzeDrugImage} 
                    disabled={!drugImage || analyzingDrug}
                    className="w-full py-4 flex items-center justify-center gap-2"
                  >
                    {analyzingDrug ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.analyzingMedicine}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search size={20} />
                        {t.identifyMedicine}
                      </div>
                    )}
                  </Button>
                </Card>

                <AnimatePresence>
                  {drugInfo && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <Card className="p-8 space-y-6 bg-white border-pink-200 shadow-xl shadow-pink-500/10">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <Pill size={32} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black text-slate-900">{drugInfo.name}</h3>
                            <p className="text-slate-500 font-medium">{drugInfo.manufacturer}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">{t.typicalDosage}</h4>
                            <p className="text-slate-700 font-medium bg-pink-50 p-3 rounded-xl border border-pink-100">{drugInfo.dosage}</p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">{t.commonUses}</h4>
                            <div className="flex flex-wrap gap-2">
                              {drugInfo.uses.map((use, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">{t.sideEffects}</h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {drugInfo.sideEffects.map((effect, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                                  {effect}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                            <AlertTriangle className="text-red-500 shrink-0" size={20} />
                            <div className="space-y-1">
                              <h4 className="text-xs font-bold uppercase tracking-widest text-red-600">{t.importantWarnings}</h4>
                              <p className="text-xs text-red-700 leading-relaxed">{drugInfo.warnings}</p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {view === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-2 h-8 bg-pink-500 rounded-full" />
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t.healthOverview}</h1>
                  </div>
                  <p className="text-slate-500 font-medium ml-5">{t.welcomeBack}</p>
                </div>
                {latestRecord && (
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 bg-slate-50 px-5 py-2.5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {t.lastUpdated}: {new Date(latestRecord.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                )}
              </div>

              {latestRecord ? (
                <>
                  {/* Emergency Alert if High Risk */}
                  {latestRecord.predictionData.riskLevel === 'High' && (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-2xl shadow-red-200/50 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/50 rounded-full -mr-32 -mt-32 blur-3xl" />
                      
                      <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-red-600/30 relative z-10">
                        <AlertTriangle size={40} className="animate-pulse" />
                      </div>
                      
                      <div className="space-y-4 flex-1 relative z-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          <h3 className="text-2xl font-black text-red-950 uppercase tracking-tighter">{t.emergencyAlert}</h3>
                          <div className="flex justify-center md:justify-start">
                            <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full animate-bounce uppercase tracking-widest">{t.critical}</span>
                          </div>
                        </div>
                        <p className="text-red-800 font-bold text-lg leading-snug max-w-2xl">
                          {t.emergencyRiskDesc}
                        </p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
                          <Button className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2 py-4 px-8 rounded-2xl shadow-xl shadow-red-600/40 font-black tracking-tight transition-all hover:scale-105 active:scale-95">
                            <MapPin size={20} />
                            {t.nearestER}
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100 py-4 px-6 rounded-2xl font-bold transition-all">
                            <Phone size={20} />
                            {t.callFamily}
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100 py-4 px-6 rounded-2xl font-bold transition-all">
                            <Bell size={20} />
                            {t.alertDoctor}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Top Stats: Health Score & Vitals */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Health Score Card */}
                    <Card className="p-8 flex flex-col items-center justify-center text-center bg-white relative overflow-hidden group">
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative z-10">
                        <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">{t.aiHealthScore}</h3>
                        <div className="relative w-52 h-52 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="104"
                              cy="104"
                              r="94"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-slate-50"
                            />
                            <motion.circle
                              cx="104"
                              cy="104"
                              r="94"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="transparent"
                              strokeDasharray={590.62}
                              initial={{ strokeDashoffset: 590.62 }}
                              animate={{ strokeDashoffset: 590.62 - (590.62 * latestRecord.predictionData.healthScore) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              className={getHealthScoreColor(latestRecord.predictionData.healthScore)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <motion.span 
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className={cn("text-6xl font-black tracking-tighter", getHealthScoreColor(latestRecord.predictionData.healthScore))}
                            >
                              {latestRecord.predictionData.healthScore}
                            </motion.span>
                            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{t.outOf100}</span>
                          </div>
                        </div>
                        <div className="mt-8 space-y-2">
                          <div className={cn("inline-block px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider", 
                            latestRecord.predictionData.healthScore >= 90 ? "bg-emerald-100 text-emerald-700" :
                            latestRecord.predictionData.healthScore >= 70 ? "bg-blue-100 text-blue-700" :
                            latestRecord.predictionData.healthScore >= 50 ? "bg-orange-100 text-orange-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {getHealthCondition(latestRecord.predictionData.healthScore)} {t.condition}
                          </div>
                          <p className="text-slate-400 text-xs font-medium max-w-[200px] mx-auto leading-relaxed">{t.basedOnVitals}</p>
                        </div>
                      </div>
                    </Card>

                    {/* Quick Vitals Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {[
                        { label: t.bloodPressure, value: `${latestRecord.bloodPressureSystolic}/${latestRecord.bloodPressureDiastolic}`, sub: 'mmHg', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100' },
                        { label: t.heartRate, value: latestRecord.heartRate, sub: 'bpm', icon: Heart, color: 'text-red-600', bg: 'bg-red-50/50', border: 'border-red-100' },
                        { label: t.bloodSugar, value: latestRecord.bloodSugar, sub: 'mg/dL', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
                        { label: t.sleep, value: latestRecord.sleepHours, sub: 'hrs/day', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100' },
                        { label: t.bmiIndex, value: (latestRecord.weight / ((latestRecord.height / 100) ** 2)).toFixed(1), sub: 'kg/m²', icon: User, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
                        { label: t.checkupDate, value: new Date(latestRecord.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), sub: t.latest, icon: History, color: 'text-slate-600', bg: 'bg-slate-50/50', border: 'border-slate-200' },
                      ].map((vital) => (
                        <Card key={vital.label} className={cn("p-6 flex flex-col justify-between border shadow-none hover:shadow-md transition-all", vital.border)}>
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm", vital.bg, vital.color)}>
                            <vital.icon size={22} />
                          </div>
                          <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{vital.label}</p>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-3xl font-black text-slate-800 tracking-tight">{vital.value}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{vital.sub}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Risk Analysis Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                      { label: t.diabetesRisk, value: latestRecord.predictionData.diabetesRisk, icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100' },
                      { label: t.heartRisk, value: latestRecord.predictionData.heartDiseaseRisk, icon: Heart, color: 'text-red-600', bg: 'bg-red-50/50', border: 'border-red-100' },
                      { label: t.hypertension, value: latestRecord.predictionData.hypertensionRisk, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50/50', border: 'border-orange-100' },
                      { label: t.kidneyRisk, value: latestRecord.predictionData.kidneyDiseaseRisk, icon: Thermometer, color: 'text-purple-600', bg: 'bg-purple-50/50', border: 'border-purple-100' },
                    ].map((risk) => (
                      <Card key={risk.label} className={cn("p-6 border shadow-none hover:shadow-md transition-all", risk.border)}>
                        <div className="flex items-center justify-between mb-6">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm", risk.bg, risk.color)}>
                            <risk.icon size={22} />
                          </div>
                          <div className={cn("text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest", 
                            risk.value > 70 ? "bg-red-100 text-red-700" : 
                            risk.value > 40 ? "bg-orange-100 text-orange-700" : 
                            "bg-emerald-100 text-emerald-700"
                          )}>
                            {risk.value > 70 ? 'High' : risk.value > 40 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                        <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{risk.label}</h4>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-black text-slate-900 tracking-tighter">{risk.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full mt-6 overflow-hidden shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.value}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn("h-full rounded-full", 
                              risk.value > 70 ? "bg-red-500" : 
                              risk.value > 40 ? "bg-orange-500" : 
                              "bg-emerald-500"
                            )}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>

                  {/* Main Content Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Health Trends */}
                    <Card className="lg:col-span-2 p-8 border-none shadow-xl shadow-slate-200/50 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 opacity-50" />
                      <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">{t.healthMetrics}</h3>
                            <p className="text-sm text-slate-500 font-medium">{t.trackingVitals}</p>
                          </div>
                          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" /> BP Systolic
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200" /> Heart Rate
                            </span>
                          </div>
                        </div>
                        <div className="h-[320px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[...records].reverse()}>
                              <defs>
                                <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                              <XAxis 
                                dataKey="createdAt" 
                                tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                dy={10}
                              />
                              <YAxis 
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                                dx={-10}
                              />
                              <Tooltip 
                                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                labelFormatter={(label) => new Date(label).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                              />
                              <Area type="monotone" dataKey="bloodPressureSystolic" stroke="#10b981" fillOpacity={1} fill="url(#colorBp)" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                              <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHr)" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </Card>

                    {/* AI Health Report */}
                    <Card className="p-8 bg-slate-900 text-white border-none shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-emerald-500/20 transition-colors" />
                      
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Stethoscope size={24} className="text-slate-900" />
                          </div>
                          <div>
                            <h3 className="text-xl font-black tracking-tight">{t.aiHealthReport}</h3>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t.personalizedRecommendations}</p>
                          </div>
                        </div>

                        <div className="space-y-8">
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-3">Summary</h4>
                            <p className="text-sm leading-relaxed text-slate-300 font-medium italic">
                              "{latestRecord.predictionData.summary}"
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Action Plan</h4>
                            {latestRecord.predictionData.recommendations.map((rec, i) => (
                              <div key={i} className="flex items-start gap-4 group/item">
                                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 group-hover/item:bg-emerald-500 transition-all duration-300">
                                  <CheckCircle size={14} className="text-emerald-500 group-hover/item:text-slate-900" />
                                </div>
                                <p className="text-sm text-slate-300 font-medium leading-relaxed group-hover/item:text-white transition-colors">{rec}</p>
                              </div>
                            ))}
                          </div>

                          <Button 
                            onClick={downloadReport}
                            className="w-full py-6 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-black tracking-tight transition-all shadow-lg shadow-emerald-500/20"
                          >
                            <div className="flex items-center gap-2">
                              <History size={20} />
                              {t.downloadReport}
                            </div>
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Personalized Treatment Recommendation System */}
                    <Card className="lg:col-span-3 p-10 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 text-white border-none shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl group-hover:bg-white/10 transition-all duration-1000" />
                      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full -ml-48 -mb-48 blur-3xl" />
                      
                      <div className="relative z-10">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl">
                              <Sparkles size={32} className="text-indigo-300 animate-pulse" />
                            </div>
                            <div>
                              <h3 className="text-3xl font-black tracking-tight mb-1">{t.treatmentSystem}</h3>
                              <p className="text-indigo-200 font-medium opacity-80">{t.predictSuccess} & {t.analyzePatientData}</p>
                            </div>
                          </div>
                          <Button 
                            onClick={handleGetTreatments}
                            disabled={analyzingTreatments}
                            className="bg-white text-indigo-900 hover:bg-indigo-50 font-black tracking-tight px-10 py-4 rounded-2xl shadow-2xl shadow-indigo-950/50 transition-all flex items-center gap-3 disabled:opacity-50"
                          >
                            {analyzingTreatments ? (
                              <>
                                <div className="w-5 h-5 border-3 border-indigo-900 border-t-transparent rounded-full animate-spin" />
                                {t.aiAnalyzing}...
                              </>
                            ) : (
                              <>
                                <Brain size={22} />
                                {t.getRecommendations}
                              </>
                            )}
                          </Button>
                        </div>

                        {treatmentPlan ? (
                          <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
                          >
                            <div className="space-y-8">
                              <div className="p-8 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-inner">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 mb-6 flex items-center gap-3">
                                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                  {t.patientAnalysis}
                                </h4>
                                <p className="text-xl leading-relaxed text-white font-medium italic opacity-90">
                                  "{treatmentPlan.patientAnalysis}"
                                </p>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-300 flex items-center gap-3 mb-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
                                {t.personalizedRecs}
                              </h4>
                              <div className="space-y-5">
                                {treatmentPlan.recommendations.map((rec, i) => (
                                  <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all duration-300 group/rec"
                                  >
                                    <div className="flex items-start justify-between mb-4">
                                      <h5 className="text-lg font-black text-white tracking-tight group-hover/rec:text-indigo-300 transition-colors">{rec.treatmentName}</h5>
                                      <div className="flex items-end flex-col">
                                        <span className="text-3xl font-black text-emerald-400 tracking-tighter">{rec.successProbability}%</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-300/60">{t.successChance}</span>
                                      </div>
                                    </div>
                                    
                                    <div className="w-full bg-white/10 h-2 rounded-full mb-5 overflow-hidden shadow-inner">
                                      <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${rec.successProbability}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                                      />
                                    </div>

                                    <p className="text-sm text-indigo-100/70 leading-relaxed font-medium">
                                      <span className="font-bold text-white">{t.treatmentReasoning}:</span> {rec.reasoning}
                                    </p>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-bounce">
                              <Brain size={48} className="text-indigo-300/30" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">{t.readyToAnalyze}</h4>
                            <p className="text-indigo-200/60 max-w-md mx-auto">
                              Click the button above to generate a personalized treatment plan based on your latest health data, medical history, and lifestyle.
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                    {/* Recent Reports Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold">{t.recentReports}</h3>
                        <Button variant="outline" onClick={() => setView('history')} className="text-xs px-3 py-1">
                          {t.viewAll}
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        {records.slice(0, 5).map((record) => (
                          <Card key={record.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setView('history')}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", 
                                  record.predictionData.riskLevel === 'High' ? "bg-red-100 text-red-600" : 
                                  record.predictionData.riskLevel === 'Medium' ? "bg-orange-100 text-orange-600" : 
                                  "bg-emerald-100 text-emerald-600"
                                )}>
                                  <Activity size={20} />
                                </div>
                                <div>
                                  <p className="font-bold text-sm">{new Date(record.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                  <p className="text-xs text-slate-500">Score: {record.predictionData.healthScore}/100 • {record.predictionData.riskLevel} Risk</p>
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-slate-300" />
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Activity size={40} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{t.noData}</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">{t.noDataDesc}</p>
                  </div>
                  <Button onClick={() => setView('form')} className="mt-4">
                    {t.startFirst}
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {view === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold">{t.healthAssessment}</h2>
                    <p className="text-slate-500">{t.vitalsAnalysis}</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => setView('dashboard')} 
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {t.cancel}
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={t.age} 
                      type="number" 
                      value={formData.age} 
                      onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} 
                    />
                    <Select 
                      label={t.gender} 
                      value={formData.gender} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      options={[
                        { label: t.male, value: 'male' },
                        { label: t.female, value: 'female' },
                        { label: t.other, value: 'other' }
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={t.height} 
                      type="number" 
                      value={formData.height} 
                      onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})} 
                    />
                    <Input 
                      label={t.weight} 
                      type="number" 
                      value={formData.weight} 
                      onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={t.bpSystolic} 
                      type="number" 
                      value={formData.bloodPressureSystolic} 
                      onChange={e => setFormData({...formData, bloodPressureSystolic: parseInt(e.target.value)})} 
                    />
                    <Input 
                      label={t.bpDiastolic} 
                      type="number" 
                      value={formData.bloodPressureDiastolic} 
                      onChange={e => setFormData({...formData, bloodPressureDiastolic: parseInt(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={t.bloodSugar} 
                      type="number" 
                      value={formData.bloodSugar} 
                      onChange={e => setFormData({...formData, bloodSugar: parseFloat(e.target.value)})} 
                    />
                    <Input 
                      label={t.heartRate} 
                      type="number" 
                      value={formData.heartRate} 
                      onChange={e => setFormData({...formData, heartRate: parseInt(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label={t.sleep} 
                      type="number" 
                      value={formData.sleepHours} 
                      onChange={e => setFormData({...formData, sleepHours: parseFloat(e.target.value)})} 
                    />
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 mt-7">
                      <input 
                        type="checkbox" 
                        id="smoking"
                        className="w-5 h-5 accent-pink-600 rounded"
                        checked={formData.isSmoking}
                        onChange={e => setFormData({...formData, isSmoking: e.target.checked})}
                      />
                      <label htmlFor="smoking" className="text-sm font-medium text-slate-700">{t.smoking}</label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">{t.symptoms}</label>
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={startListening}
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-all",
                          isListening 
                            ? "bg-red-100 text-red-600 animate-pulse" 
                            : "bg-pink-100 text-pink-600 hover:bg-pink-200"
                        )}
                      >
                        {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                        {isListening ? t.listening : t.speakSymptoms}
                      </motion.button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(t.symptomCategories) as Array<keyof typeof t.symptomCategories>).map((category) => (
                        <div key={category} className="space-y-2">
                          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {t.symptomCategories[category]}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {symptomOptions
                              .filter(opt => opt.category === category)
                              .map((symptom) => {
                                const label = symptom.label[lang];
                                const isSelected = formData.symptoms.split(', ').includes(label);
                                return (
                                  <motion.button
                                    key={symptom.id}
                                    type="button"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                      const current = formData.symptoms ? formData.symptoms.split(', ') : [];
                                      const next = isSelected 
                                        ? current.filter(s => s !== label)
                                        : [...current, label];
                                      setFormData({...formData, symptoms: next.filter(Boolean).join(', ')});
                                    }}
                                    className={cn(
                                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                      isSelected 
                                        ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-100" 
                                        : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"
                                    )}
                                  >
                                    {label}
                                  </motion.button>
                                );
                              })}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.otherSymptoms}</label>
                      <textarea 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm resize-none"
                        rows={2}
                        placeholder={t.typeOther}
                        value={formData.symptoms.split(', ').filter(s => !symptomOptions.some(opt => opt.label[lang] === s)).join(', ')}
                        onChange={e => {
                          const predefined = formData.symptoms.split(', ').filter(s => symptomOptions.some(opt => opt.label[lang] === s));
                          const custom = e.target.value;
                          const next = [...predefined, custom].filter(s => s.trim() !== '').join(', ');
                          setFormData({...formData, symptoms: next});
                        }}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 text-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {t.aiAnalyzing}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {t.analyzeHealth}
                        <ArrowRight size={20} />
                      </div>
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t.history}</h2>
                <Button variant="outline" onClick={() => fetchRecords()} className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  {t.refresh}
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {records.map((record) => (
                  <Card key={record.id} className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", 
                          record.predictionData.riskLevel === 'High' ? "bg-red-100 text-red-600" : 
                          record.predictionData.riskLevel === 'Medium' ? "bg-orange-100 text-orange-600" : 
                          "bg-emerald-100 text-emerald-600"
                        )}>
                          <Activity size={24} />
                        </div>
                        <div>
                          <h3 className="font-bold">Checkup on {new Date(record.createdAt).toLocaleDateString()}</h3>
                          <p className="text-sm text-slate-500">
                            BP: {record.bloodPressureSystolic}/{record.bloodPressureDiastolic} • 
                            Sugar: {record.bloodSugar} • 
                            HR: {record.heartRate}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Risk Level</p>
                          <p className={cn("font-bold", 
                            record.predictionData.riskLevel === 'High' ? "text-red-600" : 
                            record.predictionData.riskLevel === 'Medium' ? "text-orange-600" : 
                            "text-emerald-600"
                          )}>
                            {record.predictionData.riskLevel}
                          </p>
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E91E63] rounded-lg flex items-center justify-center text-white">
              <Activity size={18} />
            </div>
            <span className="text-lg font-bold tracking-tight">HealthGuard AI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 HealthGuard AI. For informational purposes only. Not a substitute for professional medical advice.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><Info size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><User size={20} /></a>
            <a href="#" className="text-slate-400 hover:text-pink-600 transition-colors"><LogOut size={20} /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
