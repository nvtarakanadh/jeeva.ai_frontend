import React from 'react';
import { TestTube, Clock, Users, CheckCircle, Calendar, MapPin, Star, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ClinicalResearch: React.FC = () => {
  const clinicalTrials = [
    {
      id: 1,
      title: "Diabetes Management Study",
      sponsor: "MedResearch Institute",
      phase: "Phase III",
      condition: "Type 2 Diabetes",
      location: "Mumbai, Maharashtra",
      duration: "12 months",
      participants: "200",
      compensation: "₹15,000",
      status: "Recruiting",
      description: "Testing new oral medication for better blood sugar control",
      eligibility: ["Age 18-65", "Type 2 Diabetes", "HbA1c 7-10%"],
      benefits: ["Free medication", "Regular health checkups", "Compensation"]
    },
    {
      id: 2,
      title: "Cardiac Rehabilitation Program",
      sponsor: "HeartCare Foundation",
      phase: "Phase II",
      condition: "Post-Heart Attack Recovery",
      location: "Delhi, NCR",
      duration: "6 months",
      participants: "150",
      compensation: "₹25,000",
      status: "Recruiting",
      description: "Comprehensive rehabilitation program for heart attack survivors",
      eligibility: ["Recent heart attack", "Age 40-70", "Stable condition"],
      benefits: ["Exercise program", "Nutrition counseling", "Psychological support"]
    },
    {
      id: 3,
      title: "Cancer Immunotherapy Trial",
      sponsor: "Oncology Research Center",
      phase: "Phase I",
      condition: "Advanced Lung Cancer",
      location: "Bangalore, Karnataka",
      duration: "18 months",
      participants: "50",
      compensation: "₹50,000",
      status: "Recruiting",
      description: "Testing new immunotherapy drug for lung cancer treatment",
      eligibility: ["Advanced lung cancer", "Failed standard treatment", "Age 18+"],
      benefits: ["Cutting-edge treatment", "Comprehensive care", "High compensation"]
    },
    {
      id: 4,
      title: "Mental Health Study",
      sponsor: "Psychiatry Research Institute",
      phase: "Phase II",
      condition: "Depression and Anxiety",
      location: "Chennai, Tamil Nadu",
      duration: "8 months",
      participants: "100",
      compensation: "₹12,000",
      status: "Recruiting",
      description: "Testing new therapy approach for depression and anxiety",
      eligibility: ["Diagnosed depression/anxiety", "Age 18-60", "No recent hospitalization"],
      benefits: ["Free therapy sessions", "Medication support", "Regular monitoring"]
    },
    {
      id: 5,
      title: "Pediatric Vaccine Study",
      sponsor: "Child Health Research",
      phase: "Phase III",
      condition: "Childhood Vaccination",
      location: "Pune, Maharashtra",
      duration: "24 months",
      participants: "300",
      compensation: "₹8,000",
      status: "Recruiting",
      description: "Testing new combination vaccine for children",
      eligibility: ["Age 6 months - 2 years", "Healthy children", "Parental consent"],
      benefits: ["Free vaccination", "Regular health monitoring", "Travel reimbursement"]
    },
    {
      id: 6,
      title: "Alzheimer's Research Study",
      sponsor: "Neurology Research Center",
      phase: "Phase II",
      condition: "Early Alzheimer's Disease",
      location: "Kolkata, West Bengal",
      duration: "15 months",
      participants: "80",
      compensation: "₹30,000",
      status: "Recruiting",
      description: "Testing new drug for early-stage Alzheimer's treatment",
      eligibility: ["Early Alzheimer's diagnosis", "Age 50-80", "Caregiver available"],
      benefits: ["Advanced treatment", "Regular monitoring", "Family support"]
    }
  ];

  const researchCategories = [
    { name: "Cardiology", count: 12, icon: "❤️" },
    { name: "Oncology", count: 8, icon: "🎗️" },
    { name: "Diabetes", count: 15, icon: "🍯" },
    { name: "Mental Health", count: 10, icon: "🧠" },
    { name: "Pediatrics", count: 6, icon: "👶" },
    { name: "Neurology", count: 9, icon: "🧠" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TestTube className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clinical Research</h1>
              <p className="text-gray-600 dark:text-gray-300">Participate in clinical trials and contribute to medical advancement</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Research Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Research Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {researchCategories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <p className="font-medium text-gray-900 dark:text-white">{category.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{category.count} studies</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Ongoing Clinical Trials */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Ongoing Clinical Trials</h2>
          <div className="space-y-6">
            {clinicalTrials.map((trial) => (
              <Card key={trial.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trial.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{trial.sponsor}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={trial.status === "Recruiting" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {trial.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {trial.phase}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{trial.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Calendar className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">{trial.duration}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Users className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Participants</p>
                        <p className="font-semibold text-green-900 dark:text-green-100">{trial.participants}</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <MapPin className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-semibold text-purple-900 dark:text-purple-100 text-xs">{trial.location}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Star className="h-4 w-4 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Compensation</p>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">{trial.compensation}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Eligibility Criteria:</p>
                        <div className="space-y-1">
                          {trial.eligibility.map((criteria, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              {criteria}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Benefits:</p>
                        <div className="space-y-1">
                          {trial.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="h-3 w-3 text-blue-500" />
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        Learn More & Apply
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Participate in Clinical Research */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Participate in Clinical Research?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TestTube className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Advance Medicine</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contribute to medical breakthroughs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Access New Treatments</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get cutting-edge therapies</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Help Others</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Make a difference in healthcare</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integration Notice */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TestTube className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Integration with Research Partners Coming Soon
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  We're partnering with leading research institutions to connect you with relevant clinical trials and research opportunities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Clinical Research Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're working with research institutions to provide you with access to clinical trials and research studies that match your health profile.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClinicalResearch;
