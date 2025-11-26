import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ArrowLeft, UserPlus, Users, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function StaffManagement() {
  const navigate = useNavigate();
  const { sessionToken, user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'teacher',
    subjects: '',
    grades: ''
  });

  useEffect(() => {
    // Check if user is principal
    if (user && user.role !== 'principal') {
      toast.error('Access denied. Only principals can manage staff.');
      navigate('/dashboard');
    }
    fetchStaff();
  }, [user]);

  const fetchStaff = async () => {
    try {
      // Note: This endpoint would need to be created in backend
      // For now, we'll use a placeholder
      setStaff([
        {
          id: '1',
          name: 'John Teacher',
          email: 'john@school.edu',
          role: 'teacher',
          subjects: ['Mathematics', 'Science'],
          grades: ['8', '9']
        },
        {
          id: '2',
          name: 'Jane VP',
          email: 'jane@school.edu',
          role: 'vice_principal',
          subjects: [],
          grades: []
        }
      ]);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();

    try {
      // Parse subjects and grades
      const subjectsArray = newStaff.subjects.split(',').map(s => s.trim()).filter(s => s);
      const gradesArray = newStaff.grades.split(',').map(g => g.trim()).filter(g => g);

      const staffData = {
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
        subjects: subjectsArray,
        grades: gradesArray
      };

      // API call would go here
      toast.success('Staff member added successfully!');
      setShowAddDialog(false);
      setNewStaff({ name: '', email: '', role: 'teacher', subjects: '', grades: '' });
      fetchStaff();
    } catch (error) {
      console.error('Error adding staff:', error);
      toast.error('Failed to add staff member');
    }
  };

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Management</h1>
            <p className="text-gray-600">Manage teachers and administrative staff</p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button
                data-testid="add-staff-button"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Staff Member</DialogTitle>
                <DialogDescription>Enter staff member information</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    placeholder="john.doe@school.edu"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={newStaff.role}
                    onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="vice_principal">Vice Principal</SelectItem>
                      <SelectItem value="department_head">Department Head</SelectItem>
                      <SelectItem value="school_secretary">School Secretary</SelectItem>
                      <SelectItem value="counselor">Counselor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newStaff.role === 'teacher' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="subjects">Subjects (comma-separated)</Label>
                      <Input
                        id="subjects"
                        value={newStaff.subjects}
                        onChange={(e) => setNewStaff({ ...newStaff, subjects: e.target.value })}
                        placeholder="Mathematics, Science"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grades">Grades (comma-separated)</Label>
                      <Input
                        id="grades"
                        value={newStaff.grades}
                        onChange={(e) => setNewStaff({ ...newStaff, grades: e.target.value })}
                        placeholder="8, 9, 10"
                      />
                    </div>
                  </>
                )}

                <Button type="submit" className="w-full">
                  Add Staff Member
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-white"
              data-testid="search-staff"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-cyan-600 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredStaff.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="border-none shadow-lg bg-white">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="text-sm">{member.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-semibold text-gray-700">Role:</span>
                      <span className="ml-2 text-sm text-gray-600 capitalize">
                        {member.role.replace('_', ' ')}
                      </span>
                    </div>
                    {member.subjects && member.subjects.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Subjects:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.subjects.map((subject, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                            >
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {member.grades && member.grades.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-700">Grades:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {member.grades.map((grade, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded"
                            >
                              {grade}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-none shadow-lg bg-white">
            <CardContent className="py-16 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try a different search term' : 'Add your first staff member to get started'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowAddDialog(true)}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
