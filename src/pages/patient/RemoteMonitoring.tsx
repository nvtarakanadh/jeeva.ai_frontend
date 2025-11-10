import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, ArrowLeft, Smartphone, AlertTriangle, Calendar, Users, Building2, Heart, FileText, TrendingUp, Mic } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const RemoteMonitoring: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Smartphone,
      title: 'Device Integration',
      description: 'Compatible with wearables and IoT devices for tracking SpO₂, HR, BP, glucose, respiration, and temperature.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      icon: AlertTriangle,
      title: 'AI-Powered Alerts & Anomaly Detection',
      description: 'Predictive analytics for early detection and real-time notifications.',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      icon: Calendar,
      title: 'Custom Monitoring Plans',
      description: 'Create personalized care protocols for chronic or post-surgical recovery.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      icon: Activity,
      title: 'Patient Dashboard',
      description: 'Visual insights into daily vitals, activity, and medication adherence.',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      icon: Users,
      title: 'Clinician Dashboard',
      description: 'Centralized view of multiple patients with color-coded alerts.',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
    },
    {
      icon: Building2,
      title: 'Hospital Integration',
      description: 'Remote data sync with hospital EMR and Jeeva Cloud for continuity.',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    },
    {
      icon: Heart,
      title: 'Family & Caregiver Access',
      description: 'Controlled access for family members to monitor elderly or critical patients.',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
    },
    {
      icon: FileText,
      title: 'Periodic Health Reports',
      description: 'Automatically generated summaries of patient progress and physician notes.',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
    }
  ];

  const addOns = [
    {
      icon: TrendingUp,
      title: 'Predictive Health Analytics',
      description: 'Premium AI-powered insights for proactive health management.',
      badge: 'Premium'
    },
    {
      icon: Mic,
      title: 'Voice-based Symptom Reporting',
      description: 'Patients can report symptoms using voice commands for hands-free monitoring.',
      badge: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl animate-pulse">
              <Activity className="h-10 w-10 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Remote Monitoring</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Continuous Care Beyond Hospitals — Real-time patient insights powered by AI.
              </p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 px-4 py-1.5 text-sm font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Overview Paragraph */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/10 dark:to-cyan-900/10 border-teal-200 dark:border-teal-800">
          <CardContent className="p-6">
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Jeeva Remote Monitoring</strong> empowers healthcare providers to track patients' vitals in real-time using connected IoT medical devices. It uses AI-driven analytics to detect anomalies early and provides personalized care plans for chronic and post-surgical patients.
            </p>
          </CardContent>
        </Card>

        {/* Key Features Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🔹</span>
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${feature.color} flex-shrink-0`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{feature.title}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Optional Add-ons Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Optional Add-ons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addOns.map((addOn, index) => {
              const Icon = addOn.icon;
              return (
                <Card key={index} className="border-2 border-dashed border-teal-300 dark:border-teal-700 hover:border-solid hover:shadow-md transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400 flex-shrink-0">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{addOn.title}</CardTitle>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {addOn.badge}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed ml-16">
                      {addOn.description}
                    </p>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Illustration Section */}
        <Card className="mb-8 bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-100 dark:from-teal-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-400 rounded-full opacity-20 animate-ping"></div>
                <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full p-8">
                  <Activity className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Health Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay connected with your health through continuous monitoring and AI-powered insights, ensuring timely interventions and better outcomes.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex flex-col items-center gap-4">
          <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 px-6 py-2 text-base font-semibold">
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon
          </Badge>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white px-8 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RemoteMonitoring;

