import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GraduationCap, Users, ClipboardList, Settings, LogOut, BookOpen, FileText, PlayCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import DemoTour from '../components/DemoTour';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function Dashboard() {
  const { user, sessionToken, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ students: 0, observations: 0, reports: 0 });
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, schoolRes] = await Promise.all([
        axios.get(`${API}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${sessionToken}` }
        }),
        axios.get(`${API}/school/info`, {
          headers: { Authorization: `Bearer ${sessionToken}` }
        })
      ]);
      setStats(statsRes.data);
      setSchool(schoolRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-cyan-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If no school setup, redirect to setup
  if (!school) {
    navigate('/setup');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100">
      {/* Navigation */}
      <nav className="backdrop-blur-glass bg-white/80 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-gray-900">LPAI</span>
                <p className="text-xs text-gray-500">{school?.school_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user?.picture || `https://ui-avatars.com/api/?name=${user?.name}&background=0891b2&color=fff`} 
                  alt={user?.name}
                  className="w-10 h-10 rounded-full border-2 border-cyan-200"
                />
                <div>
                  <div className="text-sm font-semibold text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</div>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-600">Here's what's happening with your students today.</p>
          </div>
          <Button
            onClick={() => setShowDemo(true)}
            data-testid="take-tour-button"
            variant="outline"
            className="flex items-center space-x-2 border-cyan-600 text-cyan-600 hover:bg-cyan-50"
          >
            <PlayCircle className="h-5 w-5" />
            <span>Take a Tour</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-none shadow-lg bg-white" data-testid="stat-students">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
              <Users className="h-5 w-5 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.students}</div>
              <p className="text-xs text-gray-500 mt-1">Active students</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white" data-testid="stat-observations">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Observations</CardTitle>
              <ClipboardList className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.observations}</div>
              <p className="text-xs text-gray-500 mt-1">This term</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-white" data-testid="stat-reports">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reports</CardTitle>
              <FileText className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.reports}</div>
              <p className="text-xs text-gray-500 mt-1">Generated</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Button
            onClick={() => navigate('/classroom')}
            data-testid="classroom-mode-btn"
            className="h-auto py-6 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 flex-col items-center space-y-2"
          >
            <BookOpen className="h-8 w-8" />
            <span className="font-semibold">Classroom Mode</span>
          </Button>

          <Button
            onClick={() => navigate('/students')}
            data-testid="students-btn"
            className="h-auto py-6 bg-gradient-to-br from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex-col items-center space-y-2"
          >
            <Users className="h-8 w-8" />
            <span className="font-semibold">Students</span>
          </Button>

          <Button
            onClick={() => navigate('/curriculum')}
            data-testid="curriculum-btn"
            className="h-auto py-6 bg-gradient-to-br from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 flex-col items-center space-y-2"
          >
            <BookOpen className="h-8 w-8" />
            <span className="font-semibold">Curriculum</span>
          </Button>

          <Button
            onClick={() => navigate('/reports')}
            data-testid="reports-btn"
            className="h-auto py-6 bg-gradient-to-br from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex-col items-center space-y-2"
          >
            <FileText className="h-8 w-8" />
            <span className="font-semibold">Reports</span>
          </Button>
        </div>

        {/* Recent Activity */}
        <Card className="border-none shadow-lg bg-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No recent activity to display</p>
              <p className="text-sm mt-2">Start recording observations to see activity here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Tour */}
      {showDemo && <DemoTour onComplete={() => setShowDemo(false)} />}
    </div>
  );
}
