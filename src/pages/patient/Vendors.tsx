import React from 'react';
import { Building2, Search, Filter, MapPin, Phone, Mail, Star, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Vendors: React.FC = () => {
  const sampleVendors = [
    {
      id: 1,
      name: "MedTech Solutions",
      category: "Medical Equipment",
      location: "Mumbai, Maharashtra",
      phone: "+91 98765 43210",
      email: "contact@medtech.com",
      rating: 4.8,
      status: "Verified",
      specialties: ["Surgical Instruments", "Diagnostic Equipment", "Patient Monitoring"]
    },
    {
      id: 2,
      name: "HealthCare Supplies Ltd",
      category: "Medical Supplies",
      location: "Delhi, NCR",
      phone: "+91 98765 43211",
      email: "info@healthcaresupplies.com",
      rating: 4.6,
      status: "Verified",
      specialties: ["Disposable Items", "Surgical Consumables", "Safety Equipment"]
    },
    {
      id: 3,
      name: "Advanced Medical Devices",
      category: "Diagnostic Equipment",
      location: "Bangalore, Karnataka",
      phone: "+91 98765 43212",
      email: "sales@advancedmed.com",
      rating: 4.9,
      status: "Premium Partner",
      specialties: ["MRI Machines", "CT Scanners", "Ultrasound Systems"]
    },
    {
      id: 4,
      name: "Pharma Distribution Co",
      category: "Pharmaceuticals",
      location: "Chennai, Tamil Nadu",
      phone: "+91 98765 43213",
      email: "orders@pharmadist.com",
      rating: 4.7,
      status: "Verified",
      specialties: ["Generic Medicines", "Vaccines", "Specialty Drugs"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendors</h1>
              <p className="text-gray-600 dark:text-gray-300">Connect with trusted medical vendors and suppliers</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search vendors by name, category, or location..."
                    className="pl-10"
                    disabled
                  />
                </div>
                <Button variant="outline" disabled className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Medical Suppliers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Featured Medical Suppliers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleVendors.map((vendor) => (
              <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{vendor.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.category}</p>
                    </div>
                    <Badge 
                      variant={vendor.status === "Premium Partner" ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {vendor.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {vendor.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {vendor.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      {vendor.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(vendor.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {vendor.rating}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {vendor.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
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
              Full Vendor Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're working on integrating with verified medical vendors to provide you with direct access to quality medical equipment and supplies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Vendors;
