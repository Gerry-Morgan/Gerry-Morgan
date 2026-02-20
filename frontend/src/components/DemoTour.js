import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const tourSteps = [
  {
    title: "Welcome to E-Valu-iT!",
    content: "Hello! I'm Laya, your AI assistant for E-Valu-iT. I'll be your guide today as we explore how E-Valu-iT transforms student assessment through inference-based learning tracking. Let's take a tour of all the amazing features!",
    highlight: null,
    position: "center",
    action: null
  },
  {
    title: "What Makes E-Valu-iT Different?",
    content: "Unlike traditional grading systems that focus only on test scores, E-Valu-iT tracks observable evidence of student learning. We record specific inferences - things teachers can actually see students doing - and link them to curriculum outcomes. This creates a rich, detailed picture of each student's true progress.",
    highlight: null,
    position: "center",
    action: null
  },
  {
    title: "The Qualifier System",
    content: "Every observation gets a qualifier: D for Developing, M for Mastered, or I for Integrated. This shows exactly where each student is in their learning journey. It's more meaningful than just a letter grade because it shows progress over time.",
    highlight: null,
    position: "center",
    action: null
  },
  {
    title: "Dashboard Overview",
    content: "This is your command center! Here you can see student statistics, quick actions for all major features, and recent activity. Everything is just one click away. Notice the four main action cards - these are your primary tools.",
    highlight: "dashboard-actions",
    position: "center",
    action: "dashboard"
  },
  {
    title: "Classroom Mode",
    content: "This is where the magic happens! In Classroom Mode, you can record observations in real-time during class. Select a student, choose an inference from the panel, assign a qualifier, and you're done - takes just seconds. The inference panel shows common learning outcomes for quick access.",
    highlight: "classroom-btn",
    position: "bottom",
    action: "classroom"
  },
  {
    title: "Student Management",
    content: "Managing students is easy! Add them one at a time, or bulk import from CSV or Excel files. We even provide a template to make it super simple. You can search, filter, and organize students by grade or homeroom.",
    highlight: "students-btn",
    position: "bottom",
    action: "students"
  },
  {
    title: "AI Curriculum Processor",
    content: "Here's where AI really shines! Upload your curriculum documents - PDFs, Word files, or text - and I'll automatically extract learning outcomes and convert them to observable inferences. This saves hours of manual work and ensures alignment with your standards.",
    highlight: "curriculum-btn",
    position: "bottom",
    action: "curriculum"
  },
  {
    title: "Smart Reports",
    content: "Generate comprehensive progress reports instantly! Choose between PDF downloads or HTML views. Reports include qualifier distribution, attendance summaries, teacher observations, and AI-generated insights. Perfect for parent meetings and report cards.",
    highlight: "reports-btn",
    position: "bottom",
    action: "reports"
  },
  {
    title: "I'm Always Here to Help!",
    content: "See that purple button in the bottom-right corner? That's me! I'm available on every page to answer questions, guide you through features, or help with any issues. I can even speak to you - just toggle the voice button in our chat. I use Claude Sonnet 4 AI, so I'm pretty smart!",
    highlight: "global-chat",
    position: "left",
    action: null
  },
  {
    title: "Voice-Enabled AI",
    content: "When you chat with me, I can speak my responses using text-to-speech. This is perfect when you're busy or prefer listening. Just click the volume icon to enable or disable voice. I'll remember your preference!",
    highlight: null,
    position: "center",
    action: null
  },
  {
    title: "Data Security",
    content: "Your data is protected with blockchain-inspired audit trails. Every action is logged with SHA-256 hashing for tamper detection. We're compliant with FERPA, PIPEDA, and GDPR. Role-based access ensures only authorized users see sensitive information.",
    highlight: null,
    position: "center",
    action: null
  },
  {
    title: "Ready to Get Started?",
    content: "That's the tour! You now know how to use Classroom Mode for observations, manage students, process curriculum documents, generate reports, and chat with me anytime. Ready to transform student assessment? Let's make education better together!",
    highlight: null,
    position: "center",
    action: "complete"
  }
];

export default function DemoTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const synthRef = useRef(window.speechSynthesis);
  const step = tourSteps[currentStep];

  useEffect(() => {
    if (voiceEnabled && step) {
      speak(step.content);
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [currentStep, voiceEnabled]);

  const speak = (text) => {
    if (!synthRef.current) return;
    
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    
    const voices = synthRef.current.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') || 
      voice.name.includes('Samantha') ||
      voice.name.includes('Victoria')
    );
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    
    synthRef.current.speak(utterance);
  };

  const toggleVoice = () => {
    if (voiceEnabled && speaking) {
      synthRef.current.cancel();
      setSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    onComplete();
  };

  const getHighlightStyle = () => {
    if (!step.highlight) return null;

    const positions = {
      center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
      bottom: 'bottom-32 left-1/2 -translate-x-1/2',
      left: 'bottom-24 right-32'
    };

    return positions[step.position] || positions.center;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      {/* Highlight overlay */}
      {step.highlight && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute ${getHighlightStyle()}`}>
            <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></div>
            <div className="relative inline-flex rounded-full h-16 w-16 bg-cyan-500"></div>
          </div>
        </div>
      )}

      {/* Tour Card */}
      <div className={`absolute ${getHighlightStyle()} max-w-2xl w-full mx-4`}>
        <Card className="border-none shadow-2xl bg-white">
          <CardContent className="p-8">
            {/* Laya Avatar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="laya-avatar" style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  L
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Laya's Tour</h3>
                  <p className="text-sm text-gray-500">
                    {speaking ? '🎤 Speaking...' : `Step ${currentStep + 1} of ${tourSteps.length}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={toggleVoice}
                  variant="ghost"
                  size="sm"
                  title={voiceEnabled ? 'Disable voice' : 'Enable voice'}
                >
                  {voiceEnabled ? <Volume2 className="h-5 w-5 text-cyan-600" /> : <VolumeX className="h-5 w-5 text-gray-400" />}
                </Button>
                <Button
                  onClick={handleComplete}
                  variant="ghost"
                  size="sm"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h2>
              <p className="text-lg text-gray-700 leading-relaxed">{step.content}</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                variant="outline"
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center space-x-2">
                {tourSteps.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full transition-all ${
                      idx === currentStep
                        ? 'bg-cyan-600 w-8'
                        : idx < currentStep
                        ? 'bg-cyan-400'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 flex items-center"
              >
                {currentStep === tourSteps.length - 1 ? 'Complete Tour' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
