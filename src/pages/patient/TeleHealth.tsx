import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Stethoscope, Clock, ArrowLeft, CheckCircle2, Shield, CreditCard, Users, FileText, MessageSquare, Calendar, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const TeleHealth: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Video,
      title: 'Instant & Scheduled Consultations',
      description: 'Patients can book or instantly connect with verified doctors across specialties.',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      icon: FileText,
      title: 'E-Prescriptions',
      description: 'Automatically generated digital prescriptions, stored securely within the patient\'s health card.',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      icon: Stethoscope,
      title: 'Integrated Health Record Access',
      description: 'Doctors can view lab reports, scans, and vitals during consultation.',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      icon: MessageSquare,
      title: 'Multilingual Video, Audio & Chat',
      description: 'Accessible to patients across geographies with language-friendly options.',
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
    },
    {
      icon: Users,
      title: 'Doctor Dashboard',
      description: 'Custom panel for clinicians to manage appointments, prescriptions, and patient history.',
      color: 'bg-teal-100 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400'
    },
    {
      icon: Heart,
      title: 'Specialist Referrals & Second Opinions',
      description: 'Patients can seek instant second opinions or referrals within the Jeeva network.',
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
    },
    {
      icon: CreditCard,
      title: 'Payment & Insurance Integration',
      description: 'Secure payment gateway and seamless insurance claim linking.',
      color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400'
    },
    {
      icon: Shield,
      title: 'Data Privacy & Encryption',
      description: 'HIPAA and ABDM-compliant teleconsultation ensuring confidentiality.',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl animate-pulse">
              <Video className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Tele Health</h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Virtual consultations, E-prescriptions, and integrated digital care — anywhere, anytime.
              </p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-4 py-1.5 text-sm font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Overview Paragraph */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong className="text-gray-900 dark:text-white">Jeeva Tele Health</strong> enables patients to instantly connect with licensed doctors via secure, multilingual video, audio, or chat consultations. It combines digital prescriptions, integrated health records, and insurance-linked payments to provide a seamless care experience.
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

        {/* Illustration Section */}
        <Card className="mb-8 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-8">
                  <Stethoscope className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Seamless Virtual Healthcare
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience healthcare from the comfort of your home with our secure, HIPAA-compliant teleconsultation platform.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex flex-col items-center gap-4">
          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-6 py-2 text-base font-semibold">
            <Clock className="h-4 w-4 mr-2" />
            Coming Soon
          </Badge>
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeleHealth;

