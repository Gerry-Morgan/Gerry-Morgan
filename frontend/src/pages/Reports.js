import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, FileText, Download, Search, Eye } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function Reports() {
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    setGenerating(true);

    try {
      if (reportFormat === 'pdf') {
        // Generate PDF
        const response = await axios.get(
          `${API}/reports/student/${selectedStudent}/pdf`,
          {
            headers: { Authorization: `Bearer ${sessionToken}` },
            responseType: 'blob'
          }
        );

        // Download PDF
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const student = students.find(s => s.id === selectedStudent);
        a.download = `report_${student?.name.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        toast.success('PDF report downloaded!');
      } else {
        // Generate HTML (data view)
        const response = await axios.get(
          `${API}/reports/student/${selectedStudent}/html`,
          {
            headers: { Authorization: `Bearer ${sessionToken}` }
          }
        );

        setReportData(response.data);
        toast.success('HTML report generated!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
          <p className="text-gray-600">Generate comprehensive student progress reports</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Report Generator */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Generate Student Report
                </CardTitle>
                <CardDescription>
                  Create detailed progress reports with observations, attendance, and AI insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Student</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search by name..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="search-student"
                    />
                  </div>
                  
                  <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                    <SelectTrigger data-testid="student-select">
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStudents.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name} - Grade {student.grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Report Format</label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger data-testid="format-select">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center">
                          <Download className="h-4 w-4 mr-2" />
                          PDF (Download)
                        </div>
                      </SelectItem>
                      <SelectItem value="html">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2" />
                          HTML (View Online)
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={generateReport}
                  disabled={generating || !selectedStudent}
                  data-testid="generate-report-button"
                  className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {generating ? (
                    <span className="flex items-center">
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Generating Report...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Generate Report
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Report Preview */}
            {reportData && (
              <Card className="border-none shadow-lg bg-white mt-6">
                <CardHeader>
                  <CardTitle>Report Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {reportData.student.name}
                    </h3>
                    <p className="text-gray-600">
                      Grade {reportData.student.grade} • {reportData.student.homeroom}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-orange-700">
                        {reportData.observations.developing}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Developing (D)</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">
                        {reportData.observations.mastered}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Mastered (M)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        {reportData.observations.integrated}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">Integrated (I)</div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Attendance</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Days:</span>
                        <span className="ml-2 font-semibold">{reportData.attendance.total_days}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Present:</span>
                        <span className="ml-2 font-semibold">{reportData.attendance.present}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Attendance Rate:</span>
                        <span className="ml-2 font-semibold">{reportData.attendance.rate.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Report Contents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-cyan-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-700">Student information and grade</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-700">Qualifier distribution (D/M/I)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-700">Attendance summary</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-700">Teacher observations</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-700">Progress trends</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-900">Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Choose PDF for downloadable reports to share with parents or print. 
                  Choose HTML to view the report directly in your browser.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
