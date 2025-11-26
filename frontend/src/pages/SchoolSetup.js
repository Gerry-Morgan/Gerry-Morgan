import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${API_URL}/api`;

export default function SchoolSetup() {
  const { sessionToken } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    district_name: '',
    school_name: '',
    address: '',
    academic_year: '2024-2025'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${API}/school/setup`,
        formData,
        { headers: { Authorization: `Bearer ${sessionToken}` } }
      );
      
      toast.success('School setup completed successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Failed to setup school. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-sky-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl border-none shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center">
            <GraduationCap className="h-12 w-12 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome to LPAI!</CardTitle>
          <CardDescription className="text-lg text-gray-600 mt-2">
            Let's set up your school. This will only take a minute.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="district_name" className="text-gray-700 font-medium">
                School District Name
              </Label>
              <Input
                id="district_name"
                data-testid="district-name-input"
                value={formData.district_name}
                onChange={(e) => setFormData({ ...formData, district_name: e.target.value })}
                placeholder="e.g., Springfield Public Schools"
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_name" className="text-gray-700 font-medium">
                School Name
              </Label>
              <Input
                id="school_name"
                data-testid="school-name-input"
                value={formData.school_name}
                onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                placeholder="e.g., Lincoln Middle School"
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 font-medium">
                School Address
              </Label>
              <Input
                id="address"
                data-testid="address-input"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="e.g., 123 Main Street, Springfield, IL 62701"
                required
                className="h-12 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academic_year" className="text-gray-700 font-medium">
                Academic Year
              </Label>
              <Input
                id="academic_year"
                data-testid="academic-year-input"
                value={formData.academic_year}
                onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                placeholder="e.g., 2024-2025"
                required
                className="h-12 text-lg"
              />
            </div>

            <Button
              type="submit"
              data-testid="complete-setup-button"
              disabled={loading}
              className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                  Setting up...
                </span>
              ) : (
                <span className="flex items-center">
                  Complete Setup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
