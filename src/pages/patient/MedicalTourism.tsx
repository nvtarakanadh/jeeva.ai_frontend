import React from 'react';
import { Plane, MapPin, Star, Clock, Shield, Users, IndianRupee, Heart, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MedicalTourism: React.FC = () => {
  const destinations = [
    {
      id: 1,
      country: "Thailand",
      city: "Bangkok",
      hospital: "Bumrungrad International Hospital",
      specialties: ["Cardiology", "Orthopedics", "Cosmetic Surgery"],
      rating: 4.8,
      cost: "₹2,50,000",
      duration: "7-14 days",
      flag: "🇹🇭",
      description: "World-class healthcare with modern facilities and English-speaking staff"
    },
    {
      id: 2,
      country: "India",
      city: "Mumbai",
      hospital: "Apollo Hospitals",
      specialties: ["Cardiac Surgery", "Cancer Treatment", "Transplant"],
      rating: 4.9,
      cost: "₹1,80,000",
      duration: "10-21 days",
      flag: "🇮🇳",
      description: "Advanced medical technology with experienced specialists"
    },
    {
      id: 3,
      country: "Singapore",
      city: "Singapore",
      hospital: "Mount Elizabeth Hospital",
      specialties: ["Oncology", "Neurology", "Pediatrics"],
      rating: 4.7,
      cost: "₹4,20,000",
      duration: "14-28 days",
      flag: "🇸🇬",
      description: "Cutting-edge medical facilities with international standards"
    },
    {
      id: 4,
      country: "Turkey",
      city: "Istanbul",
      hospital: "Acibadem Healthcare Group",
      specialties: ["Hair Transplant", "Dental", "Eye Surgery"],
      rating: 4.6,
      cost: "₹1,50,000",
      duration: "5-10 days",
      flag: "🇹🇷",
      description: "Affordable cosmetic and dental procedures with quality care"
    },
    {
      id: 5,
      country: "Malaysia",
      city: "Kuala Lumpur",
      hospital: "Gleneagles Hospital",
      specialties: ["Fertility", "Cardiology", "Orthopedics"],
      rating: 4.5,
      cost: "₹2,20,000",
      duration: "7-14 days",
      flag: "🇲🇾",
      description: "Comprehensive healthcare packages with cultural experiences"
    },
    {
      id: 6,
      country: "South Korea",
      city: "Seoul",
      hospital: "Samsung Medical Center",
      specialties: ["Cancer Treatment", "Plastic Surgery", "Dermatology"],
      rating: 4.8,
      cost: "₹3,50,000",
      duration: "10-21 days",
      flag: "🇰🇷",
      description: "Advanced medical technology and innovative treatments"
    }
  ];

  const treatmentPackages = [
    {
      id: 1,
      name: "Cardiac Surgery Package",
      destination: "Thailand",
      duration: "14 days",
      includes: ["Surgery", "Hospital Stay", "Follow-up", "Accommodation", "Airport Transfer"],
      price: "₹3,50,000",
      savings: "₹50,000"
    },
    {
      id: 2,
      name: "Dental Implant Package",
      destination: "Turkey",
      duration: "7 days",
      includes: ["Consultation", "Surgery", "Follow-up", "Hotel Stay", "City Tour"],
      price: "₹1,20,000",
      savings: "₹30,000"
    },
    {
      id: 3,
      name: "Cancer Treatment Package",
      destination: "India",
      duration: "21 days",
      includes: ["Diagnosis", "Treatment", "Chemotherapy", "Accommodation", "Support Services"],
      price: "₹2,80,000",
      savings: "₹70,000"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Plane className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Tourism</h1>
              <p className="text-gray-600 dark:text-gray-300">Explore international treatment packages and quality healthcare abroad</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">Explore International Treatment Packages</h2>
                <p className="text-xl mb-6">Access world-class healthcare at affordable prices with comprehensive travel and treatment packages</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Quality Healthcare</h3>
                    <p className="text-sm opacity-90">Internationally accredited hospitals</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <IndianRupee className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Cost Effective</h3>
                    <p className="text-sm opacity-90">Save up to 70% on treatment costs</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Complete Care</h3>
                    <p className="text-sm opacity-90">End-to-end medical tourism support</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Popular Destinations */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Popular Medical Tourism Destinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Card key={destination.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{destination.flag}</div>
                      <div>
                        <CardTitle className="text-lg">{destination.country}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{destination.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{destination.hospital}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{destination.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <IndianRupee className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Cost</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">{destination.cost}</p>
                      </div>
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Clock className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Duration</p>
                        <p className="font-semibold text-green-900 dark:text-green-100">{destination.duration}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {destination.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
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
                        View Package
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Treatment Packages */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Featured Treatment Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treatmentPackages.map((package_) => (
              <Card key={package_.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{package_.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{package_.destination}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {package_.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">{package_.price}</span>
                      <span className="text-sm text-gray-500">Save {package_.savings}</span>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Package Includes:</p>
                      <div className="space-y-1">
                        {package_.includes.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {item}
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
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Medical Tourism */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Choose Medical Tourism?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IndianRupee className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Cost Savings</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Save 50-70% on treatment costs</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Quality Care</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Internationally accredited facilities</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Complete Support</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">End-to-end assistance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Medical Tourism Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with international hospitals and travel agencies to provide you with comprehensive medical tourism packages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MedicalTourism;
