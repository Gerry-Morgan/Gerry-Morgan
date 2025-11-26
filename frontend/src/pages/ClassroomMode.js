import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Search, Plus, CheckCircle2, Calendar, ClipboardCheck, FileEdit } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function ClassroomMode() {
  const navigate = useNavigate();
  const { sessionToken } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showObservationDialog, setShowObservationDialog] = useState(false);
  const [inferences, setInferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [observation, setObservation] = useState({
    inference_id: '',
    qualifier: '',
    notes: '',
    context: ''
  });
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [assessment, setAssessment] = useState({
    student_id: '',
    subject_id: 'general',
    assessment_type: 'quiz',
    weight: 10,
    marks: 0,
    max_marks: 100
  });
  const [activeTab, setActiveTab] = useState('observations');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  const fetchData = async () => {
    try {
      const [studentsRes, inferencesRes] = await Promise.all([
        axios.get(`${API}/students`, {
          headers: { Authorization: `Bearer ${sessionToken}` }
        }),
        axios.get(`${API}/inferences`, {
          headers: { Authorization: `Bearer ${sessionToken}` }
        })
      ]);
      
      setStudents(studentsRes.data);
      setFilteredStudents(studentsRes.data);
      setInferences(inferencesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load classroom data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecordObservation = (student) => {
    setSelectedStudent(student);
    setShowObservationDialog(true);
  };

  const handleSubmitObservation = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(
        `${API}/observations`,
        {
          student_id: selectedStudent.id,
          inference_id: observation.inference_id,
          qualifier: observation.qualifier,
          notes: observation.notes,
          context: observation.context
        },
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      
      toast.success('Observation recorded successfully!');
      setShowObservationDialog(false);
      setObservation({ inference_id: '', qualifier: '', notes: '', context: '' });
    } catch (error) {
      console.error('Error recording observation:', error);
      toast.error('Failed to record observation');
    }
  };

  const sampleInferences = [
    { id: 'inf-1', description: 'Demonstrates understanding of fractions' },
    { id: 'inf-2', description: 'Solves multi-step word problems' },
    { id: 'inf-3', description: 'Applies mathematical concepts independently' },
    { id: 'inf-4', description: 'Participates actively in class discussions' },
    { id: 'inf-5', description: 'Works collaboratively with peers' }
  ];

  const displayInferences = inferences.length > 0 ? inferences : sampleInferences;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-cyan-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Classroom Mode</h1>
          <p className="text-gray-600">Record observations and track student progress in real-time</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Student Roster */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-lg bg-white">
              <CardHeader>
                <CardTitle>Student Roster</CardTitle>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="student-search"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {filteredStudents.length > 0 ? (
                  <div className="space-y-3">
                    {filteredStudents.map((student) => (
                      <div
                        key={student.id}
                        data-testid={`student-card-${student.id}`}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{student.name}</h3>
                            <p className="text-sm text-gray-600">
                              Grade {student.grade} {student.has_iep && <span className="text-orange-600">*</span>}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleRecordObservation(student)}
                          data-testid={`record-observation-${student.id}`}
                          size="sm"
                          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Record
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No students found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Inference Panel */}
          <div>
            <Card className="border-none shadow-lg bg-white sticky top-8">
              <CardHeader>
                <CardTitle>Common Inferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {displayInferences.slice(0, 8).map((inference, idx) => (
                    <div
                      key={inference.id || idx}
                      className="p-3 bg-gray-50 rounded-lg text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <p className="text-gray-700">{inference.description}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-cyan-50 rounded-lg">
                  <h4 className="font-semibold text-sm text-cyan-900 mb-2">Qualifiers</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-D">D</span>
                      <span className="text-gray-700">Developing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-M">M</span>
                      <span className="text-gray-700">Mastered</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-I">I</span>
                      <span className="text-gray-700">Integrated</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Record Observation Dialog */}
      <Dialog open={showObservationDialog} onOpenChange={setShowObservationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Observation</DialogTitle>
            <DialogDescription>
              Recording observation for {selectedStudent?.name}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitObservation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="inference">Learning Outcome</Label>
              <Select
                value={observation.inference_id}
                onValueChange={(value) => setObservation({ ...observation, inference_id: value })}
                required
              >
                <SelectTrigger id="inference">
                  <SelectValue placeholder="Select an inference" />
                </SelectTrigger>
                <SelectContent>
                  {displayInferences.map((inference, idx) => (
                    <SelectItem key={inference.id || idx} value={inference.id || `inf-${idx}`}>
                      {inference.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifier">Qualifier</Label>
              <Select
                value={observation.qualifier}
                onValueChange={(value) => setObservation({ ...observation, qualifier: value })}
                required
              >
                <SelectTrigger id="qualifier">
                  <SelectValue placeholder="Select a qualifier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D">
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-D">D</span>
                      <span>Developing</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="M">
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-M">M</span>
                      <span>Mastered</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="I">
                    <div className="flex items-center space-x-2">
                      <span className="qualifier-badge qualifier-I">I</span>
                      <span>Integrated</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={observation.notes}
                onChange={(e) => setObservation({ ...observation, notes: e.target.value })}
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context (Optional)</Label>
              <Textarea
                id="context"
                value={observation.context}
                onChange={(e) => setObservation({ ...observation, context: e.target.value })}
                placeholder="Describe the context of this observation..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowObservationDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                data-testid="submit-observation"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Record Observation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
