import React from 'react';
import { Microscope, Activity, Heart, Eye, Brain, Zap, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MedicalDeviceCompanies: React.FC = () => {
  const deviceCategories = [
    { name: 'Monitoring', icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { name: 'Imaging', icon: Eye, color: 'bg-green-100 text-green-600' },
    { name: 'Cardiology', icon: Heart, color: 'bg-red-100 text-red-600' },
    { name: 'Neurology', icon: Brain, color: 'bg-purple-100 text-purple-600' },
    { name: 'Surgical', icon: Zap, color: 'bg-yellow-100 text-yellow-600' }
  ];

  const sampleDevices = [
    {
      id: 1,
      name: "CardioVital Monitor Pro",
      company: "MedTech Innovations",
      type: "Cardiology",
      status: "Available",
      description: "Advanced cardiac monitoring with AI-powered analysis",
      features: ["Real-time ECG", "AI Analysis", "Mobile App", "Cloud Sync"]
    },
    {
      id: 2,
      name: "NeuroScan MRI 3.0T",
      company: "Advanced Imaging Systems",
      type: "Imaging",
      status: "Coming Soon",
      description: "High-resolution MRI scanner with advanced neuroimaging capabilities",
      features: ["3.0T Field Strength", "Neuro Suite", "AI Diagnostics", "Fast Scanning"]
    },
    {
      id: 3,
      name: "Surgical Robot Alpha",
      company: "Robotic Surgery Corp",
      type: "Surgical",
      status: "Available",
      description: "Precision surgical robot for minimally invasive procedures",
      features: ["7-Axis Movement", "Haptic Feedback", "3D Visualization", "Precision Control"]
    },
    {
      id: 4,
      name: "VitalSigns Monitor",
      company: "HealthTech Solutions",
      type: "Monitoring",
      status: "Available",
      description: "Comprehensive patient monitoring system",
      features: ["Multi-parameter", "Wireless", "Alarm System", "Data Export"]
    },
    {
      id: 5,
      name: "EyeScan Pro",
      company: "VisionCare Technologies",
      type: "Imaging",
      status: "Available",
      description: "Advanced retinal imaging and diagnostic system",
      features: ["OCT Imaging", "Fundus Camera", "AI Analysis", "Portable"]
    },
    {
      id: 6,
      name: "BrainWave Analyzer",
      company: "NeuroTech Labs",
      type: "Neurology",
      status: "In Development",
      description: "EEG monitoring and brain activity analysis device",
      features: ["64-Channel EEG", "Real-time Analysis", "Machine Learning", "Clinical Reports"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Microscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Device Companies</h1>
              <p className="text-gray-600 dark:text-gray-300">Explore innovative medical devices and equipment from leading manufacturers</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Device Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Device Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {deviceCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-lg flex items-center justify-center ${category.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{category.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Explore Advanced Medical Devices */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Explore Advanced Medical Devices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleDevices.map((device) => (
              <Card key={device.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{device.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{device.company}</p>
                    </div>
                    <Badge 
                      variant={
                        device.status === "Available" ? "default" : 
                        device.status === "Coming Soon" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {device.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{device.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {device.type}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</p>
                      <div className="flex flex-wrap gap-1">
                        {device.features.map((feature, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        {device.status === "Available" ? "View Details" : "Notify When Available"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Device Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with leading medical device manufacturers to bring you access to cutting-edge medical technology and equipment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalDeviceCompanies;
