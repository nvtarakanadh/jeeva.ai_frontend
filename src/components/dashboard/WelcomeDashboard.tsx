import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, Calendar, Activity, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeDashboardProps {
  userType: 'patient' | 'doctor';
  userName?: string;
}

const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ userType, userName }) => {
  const navigate = useNavigate();

  const patientQuickActions = [
    {
      title: 'Health Records',
      description: 'View and manage your medical records',
      icon: FileText,
      href: '/health-records',
      color: 'bg-blue-500'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation with your doctor',
      icon: Calendar,
      href: '/appointments',
      color: 'bg-green-500'
    },
    {
      title: 'AI Analysis',
      description: 'Get AI-powered health insights',
      icon: Activity,
      href: '/ai-analysis',
      color: 'bg-purple-500'
    },
    {
      title: 'Upload Records',
      description: 'Add new medical documents',
      icon: Plus,
      href: '/health-records?action=upload',
      color: 'bg-orange-500'
    }
  ];

  const doctorQuickActions = [
    {
      title: 'My Patients',
      description: 'View and manage your patient list',
      icon: Users,
      href: '/doctor/patients',
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule',
      description: 'Manage your appointments and schedule',
      icon: Calendar,
      href: '/doctor/schedule',
      color: 'bg-green-500'
    },
    {
      title: 'Prescriptions',
      description: 'Create and manage prescriptions',
      icon: FileText,
      href: '/doctor/prescriptions',
      color: 'bg-purple-500'
    },
    {
      title: 'Add Patient',
      description: 'Register a new patient',
      icon: Plus,
      href: '/doctor/patients?action=add',
      color: 'bg-orange-500'
    }
  ];

  const quickActions = userType === 'patient' ? patientQuickActions : doctorQuickActions;
  const greeting = userType === 'patient' ? `Welcome back, ${userName || 'Patient'}` : `Welcome back, Dr. ${userName || 'Doctor'}`;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{greeting}</h1>
        <p className="text-lg text-gray-600">
          {userType === 'patient' 
            ? 'Your health management platform is ready to use'
            : 'Your medical practice management system is ready'
          }
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Card 
              key={index}
              className="hover:shadow-lg transition-all duration-200 cursor-pointer group"
              onClick={() => navigate(action.href)}
            >
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {action.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:bg-gray-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(action.href);
                  }}
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Getting Started Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Getting Started
          </CardTitle>
          <CardDescription>
            {userType === 'patient' 
              ? 'Here are some steps to get the most out of your health management platform:'
              : 'Here are some steps to get the most out of your practice management system:'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userType === 'patient' ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <p className="text-sm text-gray-700">Upload your medical records to get started with AI analysis</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <p className="text-sm text-gray-700">Book an appointment with your doctor for consultation</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <p className="text-sm text-gray-700">View AI-powered insights about your health status</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">1</span>
                  </div>
                  <p className="text-sm text-gray-700">Add your patients to start managing their health records</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">2</span>
                  </div>
                  <p className="text-sm text-gray-700">Schedule appointments and manage your calendar</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-semibold text-blue-600">3</span>
                  </div>
                  <p className="text-sm text-gray-700">Create prescriptions and consultation notes for your patients</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Message */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">System Ready</p>
              <p className="text-sm text-green-600">
                {userType === 'patient' 
                  ? 'Your health management platform is fully operational'
                  : 'Your practice management system is fully operational'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomeDashboard;
