import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, Plus, Search, Users, Upload, Download } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function Students() {
  const { sessionToken } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: '',
    homeroom: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API}/students`, {
        headers: { Authorization: `Bearer ${sessionToken}` }
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${API}/students`,
        newStudent,
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      toast.success('Student added successfully!');
      setShowAddDialog(false);
      setNewStudent({ name: '', grade: '', homeroom: '' });
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Failed to add student');
    }
  };

  const handleImportStudents = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Please select a file');
      return;
    }

    setImporting(true);
    const formData = new FormData();
    formData.append('file', importFile);

    try {
      const response = await axios.post(
        `${API}/students/import`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success(`Successfully imported ${response.data.imported} students!`);
      if (response.data.errors && response.data.errors.length > 0) {
        toast.warning(`${response.data.errors.length} rows had errors`);
      }
      setShowImportDialog(false);
      setImportFile(null);
      fetchStudents();
    } catch (error) {
      console.error('Error importing students:', error);
      toast.error(error.response?.data?.detail || 'Failed to import students');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,grade,homeroom,iep\\nJohn Doe,8,Room 101,false\\nJane Smith,7,Room 102,false';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success('Template downloaded!');
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Students</h1>
            <div className="flex space-x-3">
              <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="import-students-button" variant="outline" className="border-cyan-600 text-cyan-600 hover:bg-cyan-50">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Students
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Import Students</DialogTitle>
                    <DialogDescription>Upload a CSV or Excel file with student data</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleImportStudents} className="space-y-4">
                    <div className="space-y-2">
                      <Label>File Format</Label>
                      <p className="text-sm text-gray-600">
                        CSV or Excel file with columns: name, grade, homeroom, iep
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={downloadTemplate}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Template
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="file">Upload File</Label>
                      <Input
                        id="file"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={(e) => setImportFile(e.target.files[0])}
                        ref={fileInputRef}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={importing} className="w-full">
                      {importing ? 'Importing...' : 'Import Students'}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              
              <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogTrigger asChild>
                  <Button data-testid="add-student-button" className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                  </Button>
                </DialogTrigger>
                <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Student</DialogTitle>
                  <DialogDescription>Enter student information below</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Student Name</Label>
                    <Input
                      id="name"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      placeholder="Full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade">Grade</Label>
                    <Input
                      id="grade"
                      value={newStudent.grade}
                      onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
                      placeholder="e.g., 8"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeroom">Homeroom (Optional)</Label>
                    <Input
                      id="homeroom"
                      value={newStudent.homeroom}
                      onChange={(e) => setNewStudent({ ...newStudent, homeroom: e.target.value })}
                      placeholder="e.g., Room 101"
                    />
                  </div>
                  <Button type="submit" className="w-full">Add Student</Button>
                </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search students by name or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-cyan-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="card-hover border-none shadow-lg bg-white">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{student.name}</h3>
                        <p className="text-sm text-gray-600">Grade {student.grade}</p>
                        {student.homeroom && (
                          <p className="text-xs text-gray-500">{student.homeroom}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="py-16 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try a different search term' : 'Add your first student to get started'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
