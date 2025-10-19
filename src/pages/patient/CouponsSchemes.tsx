import React from 'react';
import { Ticket, Clock, Percent, Calendar, Star, CheckCircle, Gift, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CouponsSchemes: React.FC = () => {
  const discountCoupons = [
    {
      id: 1,
      title: "Health Checkup Package",
      partner: "Apollo Hospitals",
      discount: "30%",
      validTill: "2024-03-15",
      code: "APOLLO30",
      description: "Complete health checkup with blood tests, ECG, and consultation",
      category: "Health Checkup",
      minAmount: "₹2,000",
      maxDiscount: "₹1,500"
    },
    {
      id: 2,
      title: "Dental Care Special",
      partner: "Dental Care Plus",
      discount: "25%",
      validTill: "2024-02-28",
      code: "DENTAL25",
      description: "Teeth cleaning, scaling, and basic dental procedures",
      category: "Dental",
      minAmount: "₹1,500",
      maxDiscount: "₹1,000"
    },
    {
      id: 3,
      title: "Eye Care Discount",
      partner: "Vision Care Center",
      discount: "20%",
      validTill: "2024-04-10",
      code: "VISION20",
      description: "Eye examination, glasses, and contact lens fitting",
      category: "Eye Care",
      minAmount: "₹3,000",
      maxDiscount: "₹2,000"
    },
    {
      id: 4,
      title: "Pharmacy Savings",
      partner: "MedPlus Pharmacy",
      discount: "15%",
      validTill: "2024-03-30",
      code: "MEDPLUS15",
      description: "Discount on prescription medicines and health supplements",
      category: "Pharmacy",
      minAmount: "₹500",
      maxDiscount: "₹300"
    },
    {
      id: 5,
      title: "Lab Test Package",
      partner: "SRL Diagnostics",
      discount: "40%",
      validTill: "2024-02-20",
      code: "SRL40",
      description: "Complete blood count, lipid profile, and diabetes screening",
      category: "Lab Tests",
      minAmount: "₹1,000",
      maxDiscount: "₹800"
    },
    {
      id: 6,
      title: "Physiotherapy Session",
      partner: "Rehab Center",
      discount: "35%",
      validTill: "2024-03-05",
      code: "REHAB35",
      description: "Physical therapy sessions for injury recovery",
      category: "Physiotherapy",
      minAmount: "₹2,500",
      maxDiscount: "₹1,500"
    }
  ];

  const governmentSchemes = [
    {
      id: 1,
      name: "Ayushman Bharat Yojana",
      description: "Health insurance coverage up to ₹5 lakhs per family per year",
      eligibility: "Below poverty line families",
      coverage: "₹5,00,000",
      status: "Active",
      category: "Health Insurance"
    },
    {
      id: 2,
      name: "Pradhan Mantri Jan Arogya Yojana",
      description: "Free healthcare services for eligible families",
      eligibility: "Socio-Economic Caste Census (SECC) families",
      coverage: "₹5,00,000",
      status: "Active",
      category: "Free Healthcare"
    },
    {
      id: 3,
      name: "Rashtriya Swasthya Bima Yojana",
      description: "Health insurance for unorganized sector workers",
      eligibility: "Unorganized sector workers and their families",
      coverage: "₹30,000",
      status: "Active",
      category: "Health Insurance"
    },
    {
      id: 4,
      name: "Maternal Health Scheme",
      description: "Financial assistance for pregnant women",
      eligibility: "Pregnant women from BPL families",
      coverage: "₹6,000",
      status: "Active",
      category: "Maternal Health"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Ticket className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupons & Schemes</h1>
              <p className="text-gray-600 dark:text-gray-300">Discover exclusive discounts and government health schemes</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Discount Coupons */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Available Discount Coupons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountCoupons.map((coupon) => (
              <Card key={coupon.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{coupon.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{coupon.partner}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">{coupon.discount}</div>
                      <p className="text-xs text-gray-500">OFF</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{coupon.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Code:</span>
                      <Badge variant="outline" className="font-mono">{coupon.code}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Min Amount:</p>
                        <p className="font-semibold">{coupon.minAmount}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Max Discount:</p>
                        <p className="font-semibold">{coupon.maxDiscount}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Valid Till:</span>
                      <span className="text-red-600 font-medium">{coupon.validTill}</span>
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        Use Coupon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Government Health Schemes */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Government Health Schemes Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {governmentSchemes.map((scheme) => (
              <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{scheme.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.category}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {scheme.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Eligibility:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Coverage:</p>
                        <p className="text-sm font-semibold text-green-600">{scheme.coverage}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Use Our Coupons & Schemes?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Percent className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Exclusive Discounts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Save up to 40% on healthcare services</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Verified Partners</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Trusted healthcare providers</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Easy to Use</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Simple coupon codes and applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Coupons & Schemes Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with healthcare providers and government agencies to bring you exclusive discounts and access to health schemes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CouponsSchemes;
