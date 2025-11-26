import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BarChart3, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DemoTour from '../components/DemoTour';

const EMERGENT_AUTH_URL = "https://auth.emergentagent.com/?redirect=";

export default function Landing() {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);

  const handleLogin = () => {
    window.location.href = `${EMERGENT_AUTH_URL}${redirectUrl}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      {/* Navigation */}
      <nav className="backdrop-blur-glass bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LPAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/about'}
                variant="ghost"
                className="text-gray-700 hover:text-cyan-600"
              >
                Learn More
              </Button>
              <Button 
                onClick={handleLogin}
                data-testid="login-button"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-200">
              <Sparkles className="h-5 w-5 text-cyan-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Assessment Platform</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Meet <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">Laya</span>,
              <br />Your Smart Education Assistant
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Transform student assessment with inference-based learning progress tracking. 
              Laya guides you through setup, observation recording, and generates insightful reports automatically.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleLogin}
                data-testid="get-started-button"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                Get Started Free
              </Button>
              <Button 
                onClick={() => setShowDemo(true)}
                data-testid="watch-demo-button"
                variant="outline"
                className="border-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50 px-8 py-6 rounded-full text-lg font-semibold"
              >
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="laya-avatar animate-float mx-auto" style={{ width: '200px', height: '200px', fontSize: '4rem' }}>
              L
            </div>
            <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl animate-pulse">
              <div className="text-sm font-semibold text-gray-700">AI Assistant</div>
              <div className="text-xs text-gray-500">Always Available</div>
            </div>
            <div className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-xl animate-pulse" style={{animationDelay: '1s'}}>
              <div className="text-sm font-semibold text-gray-700">98% Accurate</div>
              <div className="text-xs text-gray-500">Assessment Tracking</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need for Modern Assessment
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make student assessment meaningful and efficient
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="card-hover border-none shadow-lg bg-white/80 backdrop-blur-sm" data-testid="feature-conversational">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-cyan-600" />
              </div>
              <CardTitle>Conversational AI Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Laya guides you through school setup, student enrollment, and system configuration 
                with natural conversation—one question at a time.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover border-none shadow-lg bg-white/80 backdrop-blur-sm" data-testid="feature-inference">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Inference-Based Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Record observable learning outcomes with qualifiers (Developing, Mastered, Integrated) 
                for rich, detailed progress insights.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="card-hover border-none shadow-lg bg-white/80 backdrop-blur-sm" data-testid="feature-reports">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle>Smart Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Generate comprehensive PDF or HTML reports automatically. 
                AI-powered insights and recommendations included.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Educators Love LPAI
              </h2>
              <div className="space-y-4">
                {[
                  'Save 10+ hours per week on assessment documentation',
                  'Get AI-powered recommendations for student support',
                  'Blockchain-secured audit trail for data integrity',
                  'Role-based access for principals, teachers, and parents',
                  'IEP support with modified inference tracking',
                  'Multi-format reports (PDF & HTML) with one click'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-soft p-8 rounded-3xl">
              <div className="bg-white p-6 rounded-2xl shadow-lg mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    L
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Laya</div>
                    <div className="text-xs text-gray-500">AI Assistant</div>
                  </div>
                </div>
                <p className="text-gray-700">
                  "Hello! I'm Laya. I'll help you set up your school. What is your role in the school?"
                </p>
              </div>
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-2xl shadow-lg ml-12">
                <p className="font-medium">
                  "I'm the principal."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Transform Student Assessment?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of schools using LPAI to track learning progress with AI
          </p>
          <Button 
            onClick={handleLogin}
            data-testid="cta-button"
            className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 rounded-full text-lg font-semibold shadow-xl"
          >
            Start Free Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">LPAI</span>
          </div>
          <p className="text-gray-400">
            Learning Progress AI - Powered by Emergent
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2025 LPAI. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Demo Tour */}
      {showDemo && <DemoTour onComplete={() => setShowDemo(false)} />}
    </div>
  );
}
