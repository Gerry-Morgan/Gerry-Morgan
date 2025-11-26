import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Brain, BarChart3, Shield, Users, Zap, CheckCircle2, ArrowRight, Upload } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const EMERGENT_AUTH_URL = "https://auth.emergentagent.com/?redirect=";

export default function About() {
  const navigate = useNavigate();
  const redirectUrl = encodeURIComponent(`${window.location.origin}/auth/callback`);

  const handleGetStarted = () => {
    window.location.href = `${EMERGENT_AUTH_URL}${redirectUrl}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      {/* Navigation */}
      <nav className="backdrop-blur-glass bg-white/80 border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">LPAI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => navigate('/')}
                variant="ghost"
              >
                Home
              </Button>
              <Button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-200 mb-6">
            <Brain className="h-5 w-5 text-cyan-600" />
            <span className="text-sm font-medium text-gray-700">Learning Progress AI</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            What is <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">LPAI</span>?
          </h1>
          
          <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
            LPAI (Learning Progress AI) is a revolutionary educational assessment platform that transforms 
            how schools track and evaluate student learning through inference-based progress monitoring 
            and AI-powered insights.
          </p>
        </div>
      </section>

      {/* Core Concept */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-none shadow-2xl bg-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center">The LPAI Approach</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 text-lg leading-relaxed">
                Traditional grading systems focus on test scores and final grades, but LPAI takes a fundamentally 
                different approach. Instead of just recording grades, LPAI helps educators track <strong>observable 
                evidence</strong> of student learning linked to specific curriculum outcomes.
              </p>
              
              <div className="bg-cyan-50 p-6 rounded-xl my-6">
                <h3 className="text-xl font-bold text-cyan-900 mb-3">What are Inferences?</h3>
                <p className="text-gray-700 mb-0">
                  Inferences are specific, observable learning outcomes that teachers can witness in the classroom. 
                  For example: "Student solves multi-step word problems independently" or "Student applies 
                  mathematical concepts to real-world situations."
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-xl my-6">
                <h3 className="text-xl font-bold text-blue-900 mb-3">The Qualifier System</h3>
                <p className="text-gray-700 mb-4">
                  Each observation is assigned a qualifier that indicates the student's current level:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <span className="qualifier-badge qualifier-D mt-1">D</span>
                    <div>
                      <strong className="text-gray-900">Developing:</strong>
                      <span className="text-gray-700"> Student is working toward mastery, concept is emerging</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="qualifier-badge qualifier-M mt-1">M</span>
                    <div>
                      <strong className="text-gray-900">Mastered:</strong>
                      <span className="text-gray-700"> Student has demonstrated understanding within classroom context</span>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="qualifier-badge qualifier-I mt-1">I</span>
                    <div>
                      <strong className="text-gray-900">Integrated:</strong>
                      <span className="text-gray-700"> Student can apply concept independently across contexts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Key Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <Brain className="h-12 w-12 text-cyan-600 mb-4" />
              <CardTitle>Laya AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your friendly AI guide powered by Claude Sonnet 4. Laya helps with setup, answers questions, 
                and provides insights through natural conversation—complete with voice capabilities!
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <Zap className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Classroom Mode</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Record observations in real-time during class. Quick-access student roster, inference panel, 
                and streamlined recording interface make documentation effortless.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Smart Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate comprehensive PDF or HTML reports automatically. Includes qualifier distribution, 
                attendance summaries, and AI-generated insights and recommendations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <Upload className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Curriculum Processing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload curriculum documents (PDF, DOCX, TXT) and let AI automatically extract learning outcomes 
                and convert them to observable inferences. Saves hours of setup time!
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Bulk Import</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Import students from CSV or Excel files. Automatic validation ensures data quality. 
                Download templates for easy formatting.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <Shield className="h-12 w-12 text-red-600 mb-4" />
              <CardTitle>Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Blockchain-inspired audit trail ensures data integrity. Role-based access control keeps 
                information secure. Full compliance with educational data privacy standards.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        
        <div className="space-y-8">
          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              1
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">School Setup</h3>
              <p className="text-gray-600 text-lg">
                Laya guides you through initial setup: school information, staff assignments, grade levels, 
                and subjects. The conversational AI makes configuration intuitive and quick.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              2
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Load Curriculum</h3>
              <p className="text-gray-600 text-lg">
                Upload your curriculum documents or standards. AI extracts learning outcomes and converts them 
                to observable inferences automatically, or create custom inferences for your specific needs.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              3
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Record Observations</h3>
              <p className="text-gray-600 text-lg">
                During class, quickly record observations of student learning. Select the student, choose the 
                inference, assign a qualifier (D/M/I), and add optional notes. Takes seconds per observation.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              4
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Generate Insights</h3>
              <p className="text-gray-600 text-lg">
                AI analyzes the observation data and provides recommendations for student support, identifies 
                trends, and generates comprehensive reports. Parents and administrators get clear, meaningful 
                information about student progress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Schools Choose LPAI</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              {[
                'Save 10+ hours per week on assessment documentation',
                'Get AI-powered recommendations for student interventions',
                'Track learning progress beyond test scores',
                'Generate professional reports in seconds',
                'Support IEP students with modified inference tracking',
                'Secure data with blockchain-inspired audit trails'
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Who Uses LPAI?</h3>
              <ul className="space-y-3 text-gray-700 text-lg">
                <li><strong>Principals:</strong> Full system oversight and analytics</li>
                <li><strong>Teachers:</strong> Quick observation recording and student insights</li>
                <li><strong>Parents:</strong> Clear view of child's learning progress</li>
                <li><strong>Students:</strong> Access to own progress reports</li>
                <li><strong>Counselors:</strong> Support data for interventions</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="border-none shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-white">Powered by Advanced Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-400 mb-2">Claude Sonnet 4</div>
                <p className="text-gray-300">Latest AI model for intelligent conversations and curriculum processing</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">Blockchain-Inspired</div>
                <p className="text-gray-300">Immutable audit trail for data integrity and security</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">Cloud-Based</div>
                <p className="text-gray-300">Access from anywhere, automatic backups, always up-to-date</p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <p className="text-center text-gray-200 text-lg">
                Built with FastAPI, React, and MongoDB. Enterprise-grade security and performance. 
                Compliant with FERPA, PIPEDA, and GDPR standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Student Assessment?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join forward-thinking schools using AI-powered inference-based assessment to truly understand student learning
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-cyan-600 hover:bg-gray-100 px-8 py-6 rounded-full text-lg font-semibold shadow-xl"
          >
            <span className="flex items-center">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </span>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">LPAI</span>
              </div>
              <p className="text-gray-400">
                Transforming education through AI-powered inference-based assessment
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Laya AI Assistant</li>
                <li>Classroom Mode</li>
                <li>Smart Reports</li>
                <li>Curriculum Processing</li>
                <li>Bulk Import</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Claude Sonnet 4 AI</li>
                <li>Blockchain Security</li>
                <li>Cloud Platform</li>
                <li>FERPA Compliant</li>
                <li>Enterprise Grade</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 LPAI - Learning Progress AI. Powered by Emergent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
