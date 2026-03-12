import { 
  Activity, Heart, Droplets, Thermometer, 
  AlertTriangle, CheckCircle, Info, TrendingUp,
  ArrowRight, Plus, History, LayoutDashboard,
  Stethoscope, User, LogOut, MapPin, Mic, MicOff,
  Shield, Zap, Bell, Phone, Star, MessageSquare,
  FileText, Calculator, Lightbulb, Globe, ChevronRight,
  Camera, Upload, Search, Pill
} from 'lucide-react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { predictHealthRisks, identifyDrug, type HealthData, type PredictionResult, type DrugInfo } from './services/geminiService';
import { cn } from './lib/utils';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- Types ---

interface HealthRecord extends HealthData {
  id: number;
  createdAt: string;
  predictionData: PredictionResult;
}

// --- Components ---

const Card = ({ children, className, hover = true }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <motion.div 
    whileHover={hover ? { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" } : {}}
    className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-shadow", className)}
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
  const [records, setRecords] = React.useState<HealthRecord[]>([]);
  const [reviews, setReviews] = React.useState<{id: number, name: string, rating: number, comment: string}[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);

  // Drug Detection State
  const [drugImage, setDrugImage] = React.useState<string | null>(null);
  const [drugInfo, setDrugInfo] = React.useState<DrugInfo | null>(null);
  const [analyzingDrug, setAnalyzingDrug] = React.useState(false);

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
            <span className="text-xl font-bold tracking-tight">HealthGuard AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('landing')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">Features</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('landing')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">Reviews</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('drug-detection')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">Drug Detection</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={findHospitals} className="text-sm font-medium hover:text-[#E91E63] transition-colors">Hospitals</motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('dashboard')} className="text-sm font-medium hover:text-[#E91E63] transition-colors">Dashboard</motion.button>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={() => setView('form')} className="flex items-center gap-2 bg-[#E91E63] hover:bg-[#D81B60]">
              <Plus size={18} />
              <span className="hidden sm:inline">Check Your Health</span>
            </Button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-xl border border-slate-200 hover:bg-white/20 transition-colors">
              <Globe size={20} />
            </motion.button>
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
                    AI-Powered Health Analysis
                  </div>
                  <h1 className="text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1]">
                    Proactive Health Management with <span className="text-[#E91E63]">AI Intelligence</span>
                  </h1>
                  <p className="text-xl text-slate-700 max-w-lg leading-relaxed">
                    Predict potential risks, monitor vital signs, and receive personalized medical recommendations backed by advanced machine learning.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setView('form')} className="bg-[#E91E63] hover:bg-[#D81B60] px-8 py-4 text-lg rounded-2xl flex items-center gap-2">
                      Get Started Now
                      <ArrowRight size={20} />
                    </Button>
                    <Button variant="outline" onClick={() => setView('dashboard')} className="bg-white/50 border-pink-200 hover:bg-white px-8 py-4 text-lg rounded-2xl">
                      View Dashboard
                    </Button>
                    <Button variant="outline" onClick={findHospitals} className="bg-white/50 border-pink-200 hover:bg-white px-8 py-4 text-lg rounded-2xl flex items-center gap-2">
                      <MapPin size={20} />
                      Find Nearby Hospitals
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
                    <h3 className="text-2xl font-bold">Upload Medicine Photo</h3>
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
                            <p className="font-bold text-slate-700">Click or drag to upload</p>
                            <p className="text-xs text-slate-400">Supports JPG, PNG (Max 5MB)</p>
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
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Analyzing Medicine...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Identify Medicine
                      </>
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
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">Typical Dosage</h4>
                            <p className="text-slate-700 font-medium bg-pink-50 p-3 rounded-xl border border-pink-100">{drugInfo.dosage}</p>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">Common Uses</h4>
                            <div className="flex flex-wrap gap-2">
                              {drugInfo.uses.map((use, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-pink-500">Side Effects</h4>
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
                              <h4 className="text-xs font-bold uppercase tracking-widest text-red-600">Important Warnings</h4>
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
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Health Overview</h1>
                  <p className="text-slate-500">Welcome back. Here's your latest health analysis.</p>
                </div>
                {latestRecord && (
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white px-4 py-2 rounded-full border border-slate-200">
                    <History size={14} />
                    Last updated: {new Date(latestRecord.createdAt).toLocaleDateString()}
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
                      className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 flex flex-col md:flex-row items-start gap-6 shadow-xl shadow-red-100"
                    >
                      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shrink-0 shadow-inner">
                        <AlertTriangle size={32} className="animate-pulse" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-black text-red-900 uppercase tracking-tight">Emergency Risk Alert</h3>
                          <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">CRITICAL</span>
                        </div>
                        <p className="text-red-700 font-medium leading-relaxed">
                          The AI engine has detected a <span className="font-bold underline">possible severe health event</span> (e.g., heart attack or stroke risk). Immediate action is required.
                        </p>
                        <div className="flex flex-wrap items-center gap-3 mt-4">
                          <Button variant="danger" className="flex items-center gap-2 py-3 px-6 shadow-lg shadow-red-600/20">
                            <MapPin size={18} />
                            Nearest Emergency Room
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100">
                            <Phone size={18} />
                            Call Family Contact
                          </Button>
                          <Button variant="outline" className="flex items-center gap-2 border-red-200 text-red-700 hover:bg-red-100">
                            <Bell size={18} />
                            Alert Local Doctor
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Top Stats: Health Score & Vitals */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Health Score Card */}
                    <Card className="p-8 flex flex-col items-center justify-center text-center bg-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4">
                        <Shield className="text-emerald-100" size={80} />
                      </div>
                      <h3 className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-6">AI Health Score</h3>
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            className="text-slate-100"
                          />
                          <motion.circle
                            cx="96"
                            cy="96"
                            r="88"
                            stroke="currentColor"
                            strokeWidth="12"
                            fill="transparent"
                            strokeDasharray={552.92}
                            initial={{ strokeDashoffset: 552.92 }}
                            animate={{ strokeDashoffset: 552.92 - (552.92 * latestRecord.predictionData.healthScore) / 100 }}
                            className={getHealthScoreColor(latestRecord.predictionData.healthScore)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={cn("text-5xl font-black", getHealthScoreColor(latestRecord.predictionData.healthScore))}>
                            {latestRecord.predictionData.healthScore}
                          </span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Out of 100</span>
                        </div>
                      </div>
                      <div className="mt-6 space-y-1">
                        <p className={cn("text-xl font-bold", getHealthScoreColor(latestRecord.predictionData.healthScore))}>
                          {getHealthCondition(latestRecord.predictionData.healthScore)} Condition
                        </p>
                        <p className="text-slate-400 text-sm">Based on your latest vitals and symptoms</p>
                      </div>
                    </Card>

                    {/* Quick Vitals Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Blood Pressure', value: `${latestRecord.bloodPressureSystolic}/${latestRecord.bloodPressureDiastolic}`, sub: 'mmHg', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Heart Rate', value: latestRecord.heartRate, sub: 'bpm', icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Blood Sugar', value: latestRecord.bloodSugar, sub: 'mg/dL', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Sleep Quality', value: latestRecord.sleepHours, sub: 'hrs/day', icon: Zap, color: 'text-orange-600', bg: 'bg-orange-50' },
                        { label: 'BMI Index', value: (latestRecord.weight / ((latestRecord.height / 100) ** 2)).toFixed(1), sub: 'kg/m²', icon: User, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Checkup Date', value: new Date(latestRecord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), sub: 'Latest', icon: History, color: 'text-slate-600', bg: 'bg-slate-50' },
                      ].map((vital) => (
                        <Card key={vital.label} className="p-5 flex flex-col justify-between">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-4", vital.bg, vital.color)}>
                            <vital.icon size={20} />
                          </div>
                          <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{vital.label}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-slate-800">{vital.value}</span>
                              <span className="text-[10px] font-bold text-slate-400">{vital.sub}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Risk Analysis Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Diabetes Risk', value: latestRecord.predictionData.diabetesRisk, icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50' },
                      { label: 'Heart Risk', value: latestRecord.predictionData.heartDiseaseRisk, icon: Heart, color: 'text-red-600', bg: 'bg-red-50' },
                      { label: 'Hypertension', value: latestRecord.predictionData.hypertensionRisk, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                      { label: 'Kidney Risk', value: latestRecord.predictionData.kidneyDiseaseRisk, icon: Thermometer, color: 'text-purple-600', bg: 'bg-purple-50' },
                    ].map((risk) => (
                      <Card key={risk.label} className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", risk.bg, risk.color)}>
                            <risk.icon size={20} />
                          </div>
                          <span className={cn("text-xs font-bold px-2 py-1 rounded-full", 
                            risk.value > 70 ? "bg-red-100 text-red-700" : 
                            risk.value > 40 ? "bg-orange-100 text-orange-700" : 
                            "bg-emerald-100 text-emerald-700"
                          )}>
                            {risk.value > 70 ? 'High' : risk.value > 40 ? 'Medium' : 'Low'}
                          </span>
                        </div>
                        <h4 className="text-slate-500 text-sm font-medium">{risk.label}</h4>
                        <div className="flex items-end gap-1 mt-1">
                          <span className="text-3xl font-bold text-slate-900">{risk.value}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${risk.value}%` }}
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
                    <Card className="lg:col-span-2 p-6">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h3 className="text-lg font-bold">Health Metrics Trend</h3>
                          <p className="text-sm text-slate-500">Tracking your vitals over time</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" /> BP Systolic
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-blue-500" /> Heart Rate
                          </span>
                        </div>
                      </div>
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[...records].reverse()}>
                            <defs>
                              <linearGradient id="colorBp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="createdAt" 
                              tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748b' }}
                            />
                            <YAxis 
                              axisLine={false}
                              tickLine={false}
                              tick={{ fontSize: 12, fill: '#64748b' }}
                            />
                            <Tooltip 
                              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              labelFormatter={(label) => new Date(label).toLocaleString()}
                            />
                            <Area type="monotone" dataKey="bloodPressureSystolic" stroke="#10b981" fillOpacity={1} fill="url(#colorBp)" strokeWidth={2} />
                            <Area type="monotone" dataKey="heartRate" stroke="#3b82f6" fillOpacity={1} fill="url(#colorHr)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* AI Recommendations */}
                    <Card className="p-6 bg-slate-900 text-white border-none shadow-xl shadow-slate-900/20">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                          <Stethoscope size={20} />
                        </div>
                        <div>
                          <h3 className="font-bold">AI Health Report</h3>
                          <p className="text-xs text-slate-400">Personalized recommendations</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">Summary</h4>
                          <p className="text-sm leading-relaxed text-slate-300">
                            {latestRecord.predictionData.summary}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Action Plan</h4>
                          {latestRecord.predictionData.recommendations.map((rec, i) => (
                            <div key={i} className="flex items-start gap-3 group">
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-emerald-500 transition-colors">
                                <CheckCircle size={12} className="text-emerald-500 group-hover:text-white" />
                              </div>
                              <p className="text-sm text-slate-300">{rec}</p>
                            </div>
                          ))}
                        </div>

                        <Button 
                          variant="primary" 
                          onClick={downloadReport}
                          className="w-full mt-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold"
                        >
                          Download Full Report
                        </Button>
                      </div>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <Activity size={40} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">No Health Data Yet</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">Start your first AI-powered health checkup to see your risk analysis and trends.</p>
                  </div>
                  <Button onClick={() => setView('form')} className="mt-4">
                    Start First Checkup
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
                    <h2 className="text-2xl font-bold">Health Assessment</h2>
                    <p className="text-slate-500">Enter your vitals for AI analysis</p>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }} 
                    whileTap={{ scale: 0.9 }} 
                    onClick={() => setView('dashboard')} 
                    className="text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Age" 
                      type="number" 
                      value={formData.age} 
                      onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} 
                    />
                    <Select 
                      label="Gender" 
                      value={formData.gender} 
                      onChange={e => setFormData({...formData, gender: e.target.value})}
                      options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                        { label: 'Other', value: 'other' }
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Height (cm)" 
                      type="number" 
                      value={formData.height} 
                      onChange={e => setFormData({...formData, height: parseFloat(e.target.value)})} 
                    />
                    <Input 
                      label="Weight (kg)" 
                      type="number" 
                      value={formData.weight} 
                      onChange={e => setFormData({...formData, weight: parseFloat(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="BP Systolic (Upper)" 
                      type="number" 
                      value={formData.bloodPressureSystolic} 
                      onChange={e => setFormData({...formData, bloodPressureSystolic: parseInt(e.target.value)})} 
                    />
                    <Input 
                      label="BP Diastolic (Lower)" 
                      type="number" 
                      value={formData.bloodPressureDiastolic} 
                      onChange={e => setFormData({...formData, bloodPressureDiastolic: parseInt(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Blood Sugar (mg/dL)" 
                      type="number" 
                      value={formData.bloodSugar} 
                      onChange={e => setFormData({...formData, bloodSugar: parseFloat(e.target.value)})} 
                    />
                    <Input 
                      label="Heart Rate (bpm)" 
                      type="number" 
                      value={formData.heartRate} 
                      onChange={e => setFormData({...formData, heartRate: parseInt(e.target.value)})} 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input 
                      label="Sleep (Hours/Day)" 
                      type="number" 
                      value={formData.sleepHours} 
                      onChange={e => setFormData({...formData, sleepHours: parseFloat(e.target.value)})} 
                    />
                    <Select 
                      label="Exercise" 
                      value={formData.exerciseFrequency} 
                      onChange={e => setFormData({...formData, exerciseFrequency: e.target.value})}
                      options={[
                        { label: 'Sedentary', value: 'sedentary' },
                        { label: 'Light', value: 'light' },
                        { label: 'Moderate', value: 'moderate' },
                        { label: 'Active', value: 'active' }
                      ]}
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <input 
                      type="checkbox" 
                      id="smoking"
                      className="w-5 h-5 accent-pink-600 rounded"
                      checked={formData.isSmoking}
                      onChange={e => setFormData({...formData, isSmoking: e.target.checked})}
                    />
                    <label htmlFor="smoking" className="text-sm font-medium text-slate-700">I am a smoker</label>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Symptoms</label>
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
                        {isListening ? "Listening..." : "Speak Symptoms"}
                      </motion.button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Fatigue", "Fever", "Cough", "Shortness of breath", 
                        "Chest pain", "Headache", "Dizziness", "Nausea", 
                        "Joint pain", "Muscle aches", "Sore throat", "Loss of taste/smell"
                      ].map((symptom) => {
                        const isSelected = formData.symptoms.split(', ').includes(symptom);
                        return (
                          <motion.button
                            key={symptom}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              const currentSymptoms = formData.symptoms ? formData.symptoms.split(', ') : [];
                              let newSymptoms;
                              if (isSelected) {
                                newSymptoms = currentSymptoms.filter(s => s !== symptom);
                              } else {
                                newSymptoms = [...currentSymptoms, symptom];
                              }
                              setFormData({ ...formData, symptoms: newSymptoms.filter(Boolean).join(', ') });
                            }}
                            className={cn(
                              "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                              isSelected 
                                ? "bg-[#E91E63] text-white border-[#E91E63]" 
                                : "bg-white text-slate-600 border-slate-200 hover:border-pink-300"
                            )}
                          >
                            {symptom}
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Other / Custom Symptoms</label>
                      <input 
                        className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all text-sm"
                        placeholder="Type any other symptoms..."
                        value={formData.symptoms.split(', ').filter(s => ![
                          "Fatigue", "Fever", "Cough", "Shortness of breath", 
                          "Chest pain", "Headache", "Dizziness", "Nausea", 
                          "Joint pain", "Muscle aches", "Sore throat", "Loss of taste/smell"
                        ].includes(s)).join(', ')}
                        onChange={e => {
                          const predefined = [
                            "Fatigue", "Fever", "Cough", "Shortness of breath", 
                            "Chest pain", "Headache", "Dizziness", "Nausea", 
                            "Joint pain", "Muscle aches", "Sore throat", "Loss of taste/smell"
                          ];
                          const currentPredefined = formData.symptoms.split(', ').filter(s => predefined.includes(s));
                          const custom = e.target.value;
                          setFormData({ ...formData, symptoms: [...currentPredefined, custom].filter(Boolean).join(', ') });
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 italic">Select from common options or use voice/type for custom symptoms.</p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="w-full py-4 text-lg flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Health Data
                        <ArrowRight size={20} />
                      </>
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
                <h2 className="text-2xl font-bold">Checkup History</h2>
                <Button variant="outline" onClick={() => fetchRecords()} className="flex items-center gap-2">
                  <TrendingUp size={16} />
                  Refresh
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
