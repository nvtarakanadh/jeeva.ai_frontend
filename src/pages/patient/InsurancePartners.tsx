import React from 'react';
import { Heart, Shield, CheckCircle, Clock, Star, Users, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InsurancePartners: React.FC = () => {
  const insurancePlans = [
    {
      id: 1,
      company: "HealthGuard Insurance",
      planName: "Family Health Plus",
      type: "Family Plan",
      coverage: "₹5,00,000",
      premium: "₹2,500/month",
      rating: 4.8,
      features: ["Cashless Treatment", "Pre-existing Coverage", "Maternity Benefits", "Emergency Coverage"],
      logo: "🏥"
    },
    {
      id: 2,
      company: "MediCare Solutions",
      planName: "Senior Care Gold",
      type: "Senior Plan",
      coverage: "₹10,00,000",
      premium: "₹4,200/month",
      rating: 4.6,
      features: ["Senior Discounts", "Chronic Disease Coverage", "Home Care", "Annual Health Checkup"],
      logo: "👴"
    },
    {
      id: 3,
      company: "Wellness First",
      planName: "Individual Health Shield",
      type: "Individual Plan",
      coverage: "₹3,00,000",
      premium: "₹1,800/month",
      rating: 4.7,
      features: ["Preventive Care", "Mental Health Coverage", "Telemedicine", "Fitness Benefits"],
      logo: "💪"
    },
    {
      id: 4,
      company: "Corporate Health",
      planName: "Employee Wellness Pro",
      type: "Corporate Plan",
      coverage: "₹7,50,000",
      premium: "₹3,000/month",
      rating: 4.9,
      features: ["Group Discounts", "Executive Health", "International Coverage", "Wellness Programs"],
      logo: "🏢"
    },
    {
      id: 5,
      company: "Critical Care Plus",
      planName: "Critical Illness Cover",
      type: "Critical Illness",
      coverage: "₹15,00,000",
      premium: "₹6,500/month",
      rating: 4.5,
      features: ["25+ Critical Illnesses", "Lump Sum Payout", "No Medical Tests", "Survival Benefit"],
      logo: "🚨"
    },
    {
      id: 6,
      company: "Maternity Care",
      planName: "Mother & Child Plan",
      type: "Maternity Plan",
      coverage: "₹4,00,000",
      premium: "₹2,200/month",
      rating: 4.8,
      features: ["Prenatal Care", "Delivery Coverage", "Newborn Coverage", "Vaccination Benefits"],
      logo: "👶"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Insurance Partners</h1>
              <p className="text-gray-600 dark:text-gray-300">Find the right health insurance coverage for your needs</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Compare Health Insurance Options */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Compare Health Insurance Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insurancePlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{plan.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{plan.company}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{plan.planName}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {plan.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Coverage and Premium */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Shield className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Coverage</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">{plan.coverage}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Premium</p>
                        <p className="font-semibold text-green-900 dark:text-green-100">{plan.premium}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(plan.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {plan.rating}
                      </span>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</p>
                      <div className="space-y-1">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Insurance Statistics */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Choose Our Insurance Partners?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">50+ Partners</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trusted insurance providers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">100% Secure</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Protected transactions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Instant Claims</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Quick claim processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Insurance Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with leading insurance providers to help you find the perfect health coverage and manage your policies seamlessly.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsurancePartners;
