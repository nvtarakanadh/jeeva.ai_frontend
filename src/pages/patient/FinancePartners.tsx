import React from 'react';
import { Wallet, Clock, CheckCircle, Star, Building2, IndianRupee, Shield, Users, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FinancePartners: React.FC = () => {
  const financePartners = [
    {
      id: 1,
      name: "HealthFirst Bank",
      type: "Bank",
      services: ["Medical Loans", "Health Insurance", "Investment Plans"],
      rating: 4.8,
      status: "Active",
      description: "Specialized healthcare financing solutions",
      features: ["Low interest rates", "Quick approval", "Flexible repayment"],
      logo: "🏦"
    },
    {
      id: 2,
      name: "MediCare Finance",
      type: "NBFC",
      services: ["Personal Loans", "Medical Equipment Financing", "Credit Cards"],
      rating: 4.6,
      status: "Active",
      description: "Non-banking financial company focused on healthcare",
      features: ["No collateral required", "Online application", "24/7 support"],
      logo: "💳"
    },
    {
      id: 3,
      name: "Wellness Capital",
      type: "Investment Firm",
      services: ["Health Savings Plans", "Retirement Planning", "Tax Benefits"],
      rating: 4.9,
      status: "Active",
      description: "Investment solutions for healthcare expenses",
      features: ["Tax-saving options", "Long-term planning", "Expert advice"],
      logo: "📈"
    },
    {
      id: 4,
      name: "HealthPlus Credit Union",
      type: "Credit Union",
      services: ["Emergency Loans", "Family Health Plans", "Community Support"],
      rating: 4.7,
      status: "Active",
      description: "Community-based healthcare financing",
      features: ["Community rates", "Local support", "Flexible terms"],
      logo: "🤝"
    },
    {
      id: 5,
      name: "QuickMed Financial",
      type: "Fintech",
      services: ["Instant Loans", "Digital Payments", "Mobile Banking"],
      rating: 4.5,
      status: "Active",
      description: "Technology-driven healthcare financing",
      features: ["Instant approval", "Mobile app", "Digital-first"],
      logo: "📱"
    },
    {
      id: 6,
      name: "Family Health Finance",
      type: "Bank",
      services: ["Family Health Plans", "Education Loans", "Life Insurance"],
      rating: 4.8,
      status: "Coming Soon",
      description: "Comprehensive family healthcare financing",
      features: ["Family coverage", "Education support", "Life protection"],
      logo: "👨‍👩‍👧‍👦"
    }
  ];

  const financialServices = [
    {
      name: "Medical Loans",
      description: "Personal loans for medical expenses",
      interestRate: "8.5% - 15%",
      maxAmount: "₹50,00,000",
      tenure: "1-7 years",
      icon: "💰"
    },
    {
      name: "Health Insurance",
      description: "Comprehensive health coverage plans",
      interestRate: "N/A",
      maxAmount: "₹10,00,000",
      tenure: "1 year",
      icon: "🛡️"
    },
    {
      name: "Investment Plans",
      description: "Long-term healthcare investment options",
      interestRate: "12% - 18%",
      maxAmount: "₹1,00,00,000",
      tenure: "5-20 years",
      icon: "📊"
    },
    {
      name: "Emergency Funds",
      description: "Quick access to emergency medical funds",
      interestRate: "10% - 20%",
      maxAmount: "₹5,00,000",
      tenure: "6 months - 2 years",
      icon: "🚨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Wallet className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Finance Partners</h1>
              <p className="text-gray-600 dark:text-gray-300">Connect with financial institutions for healthcare financing solutions</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Financial Services Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Available Financial Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{service.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Rate:</span>
                      <span className="font-semibold text-green-600">{service.interestRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Max Amount:</span>
                      <span className="font-semibold text-blue-600">{service.maxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tenure:</span>
                      <span className="font-semibold text-purple-600">{service.tenure}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Finance Partners */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Our Finance Partners</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financePartners.map((partner) => (
              <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{partner.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{partner.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{partner.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{partner.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{partner.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={partner.status === "Active" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {partner.status}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {partner.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</p>
                      <div className="space-y-1">
                        {partner.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </div>
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
                        {partner.status === "Active" ? "Learn More" : "Coming Soon"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partner Onboarding Notice */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Building2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Partner Onboarding Soon
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  We're actively onboarding new financial partners to expand our healthcare financing options and provide you with more choices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Our Finance Partners */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Choose Our Finance Partners?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Trusted Partners</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified and regulated financial institutions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Competitive Rates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Best interest rates and terms</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Personalized Service</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tailored financial solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Finance Partners Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with leading financial institutions to provide you with comprehensive healthcare financing solutions and personalized financial advice.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancePartners;
