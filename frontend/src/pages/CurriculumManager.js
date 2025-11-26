import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Upload, FileText, CheckCircle2, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function CurriculumManager() {
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(`${API}/curriculum/subjects`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file || !subject || !grade) {
      toast.error('Please fill all fields');
      return;
    }

    setProcessing(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject', subject);
    formData.append('grade', grade);

    try {
      const response = await axios.post(
        `${API}/curriculum/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setResult(response.data);
      toast.success(`Successfully created ${response.data.inferences_created} inferences!`);
      
      // Reset form
      setFile(null);
      setSubject('');
      setGrade('');
      document.getElementById('file-upload').value = '';
    } catch (error) {
      console.error('Error uploading curriculum:', error);
      toast.error(error.response?.data?.detail || 'Failed to process curriculum document');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button
          onClick={() => navigate('/dashboard')}
          variant="ghost"
          className="mb-6"
          data-testid="back-to-dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Curriculum Manager</h1>
          <p className="text-gray-600">Upload curriculum documents to automatically extract learning inferences</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Form */}
          <Card className="border-none shadow-lg bg-white">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-cyan-600" />
                AI-Powered Curriculum Processing
              </CardTitle>
              <CardDescription>
                Upload a curriculum document and let AI extract observable learning outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger id="subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subj) => (
                        <SelectItem key={subj.id} value={subj.id}>
                          {subj.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select value={grade} onValueChange={setGrade} required>
                    <SelectTrigger id="grade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(13)].map((_, i) => (
                        <SelectItem key={i} value={i === 0 ? 'K' : String(i)}>
                          {i === 0 ? 'Kindergarten' : `Grade ${i}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file-upload">Curriculum Document</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-cyan-600 hover:text-cyan-700 font-semibold">
                        Choose file
                      </span>
                      <span className="text-gray-600"> or drag and drop</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PDF, DOCX, or TXT up to 10MB
                    </p>
                    {file && (
                      <p className="mt-3 text-sm text-gray-700">
                        Selected: <span className="font-semibold">{file.name}</span>
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  data-testid="process-curriculum-button"
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                >
                  {processing ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Processing with AI...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" />
                      Process Curriculum
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Instructions & Results */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-700 font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Upload Document</h4>
                    <p className="text-sm text-gray-600">
                      Upload your curriculum document in PDF, DOCX, or TXT format
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Extraction</h4>
                    <p className="text-sm text-gray-600">
                      Claude Sonnet 4 analyzes the document and extracts learning outcomes
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Observable Inferences</h4>
                    <p className="text-sm text-gray-600">
                      Outcomes are converted to observable, measurable inferences
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-700 font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Ready to Use</h4>
                    <p className="text-sm text-gray-600">
                      Inferences are stored and ready for classroom observations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Display */}
            {result && (
              <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-green-800">
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Processing Complete
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <span className="text-gray-700 font-medium">Inferences Created</span>
                      <span className="text-2xl font-bold text-green-600">
                        {result.inferences_created}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900">Sample Inferences:</h4>
                      {result.inferences.slice(0, 5).map((inference, idx) => (
                        <div key={idx} className="p-3 bg-white rounded-lg text-sm">
                          <p className="text-gray-700">{inference.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {inference.strand}
                            </span>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                              {inference.level}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Button
                      onClick={() => navigate('/classroom')}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                    >
                      Go to Classroom Mode
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
