import React from 'react';
import { Store, MapPin, Clock, Phone, Star, Truck, Filter, Search, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Pharmacies: React.FC = () => {
  const pharmacyFilters = [
    { label: "Nearby", icon: MapPin, active: true },
    { label: "24x7 Available", icon: Clock, active: false },
    { label: "Online Orders", icon: Truck, active: false }
  ];

  const samplePharmacies = [
    {
      id: 1,
      name: "MediCare Pharmacy",
      location: "Near City Hospital, Mumbai",
      distance: "0.5 km",
      phone: "+91 98765 43210",
      rating: 4.8,
      is24x7: true,
      onlineDelivery: true,
      specialties: ["Prescription Medicines", "OTC Drugs", "Health Supplements"],
      timings: "24x7 Available"
    },
    {
      id: 2,
      name: "HealthPlus Medical Store",
      location: "MG Road, Delhi",
      distance: "1.2 km",
      phone: "+91 98765 43211",
      rating: 4.6,
      is24x7: false,
      onlineDelivery: true,
      specialties: ["Generic Medicines", "Ayurvedic Products", "Medical Equipment"],
      timings: "8:00 AM - 10:00 PM"
    },
    {
      id: 3,
      name: "Apollo Pharmacy",
      location: "Commercial Street, Bangalore",
      distance: "0.8 km",
      phone: "+91 98765 43212",
      rating: 4.9,
      is24x7: true,
      onlineDelivery: true,
      specialties: ["Prescription Medicines", "Vaccines", "Health Checkups"],
      timings: "24x7 Available"
    },
    {
      id: 4,
      name: "Wellness Corner",
      location: "Anna Nagar, Chennai",
      distance: "2.1 km",
      phone: "+91 98765 43213",
      rating: 4.5,
      is24x7: false,
      onlineDelivery: false,
      specialties: ["Natural Remedies", "Homeopathy", "Wellness Products"],
      timings: "9:00 AM - 9:00 PM"
    },
    {
      id: 5,
      name: "QuickMed Express",
      location: "Salt Lake, Kolkata",
      distance: "1.5 km",
      phone: "+91 98765 43214",
      rating: 4.7,
      is24x7: true,
      onlineDelivery: true,
      specialties: ["Emergency Medicines", "Fast Delivery", "Prescription Management"],
      timings: "24x7 Available"
    },
    {
      id: 6,
      name: "Family Health Store",
      location: "Pune Station Road",
      distance: "3.2 km",
      phone: "+91 98765 43215",
      rating: 4.4,
      is24x7: false,
      onlineDelivery: true,
      specialties: ["Family Medicine", "Child Care", "Elderly Care"],
      timings: "7:00 AM - 11:00 PM"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Store className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Pharmacies</h1>
              <p className="text-gray-600 dark:text-gray-300">Find nearby pharmacies and manage your prescriptions</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search pharmacies by name or location..."
                    className="pl-10"
                    disabled
                  />
                </div>
                <Button variant="outline" disabled className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>
              </div>
              
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {pharmacyFilters.map((filter, index) => {
                  const Icon = filter.icon;
                  return (
                    <Badge
                      key={index}
                      variant={filter.active ? "default" : "outline"}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <Icon className="h-3 w-3" />
                      {filter.label}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pharmacy Listings */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Nearby Pharmacies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {samplePharmacies.map((pharmacy) => (
              <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {pharmacy.location}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">{pharmacy.distance}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{pharmacy.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Contact Info */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {pharmacy.phone}
                    </div>
                    
                    {/* Timings */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      {pharmacy.timings}
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2">
                      {pharmacy.is24x7 && (
                        <Badge variant="secondary" className="text-xs">
                          24x7
                        </Badge>
                      )}
                      {pharmacy.onlineDelivery && (
                        <Badge variant="secondary" className="text-xs">
                          Delivery Available
                        </Badge>
                      )}
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialties:</p>
                      <div className="flex flex-wrap gap-1">
                        {pharmacy.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" disabled>
                        Order Online
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prescription Upload Notice */}
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Upload className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Coming Soon: Prescription Upload Integration
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Upload your prescriptions directly and get medicines delivered to your doorstep with our integrated pharmacy partners.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Pharmacy Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with local and online pharmacies to provide you with convenient access to medicines and health products.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pharmacies;
