import React, { useState } from 'react';
import { Calculator, Clock, CheckCircle, TrendingUp, Shield, Percent, IndianRupee } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Loans: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('500000');
  const [interestRate, setInterestRate] = useState('12');
  const [tenure, setTenure] = useState('24');

  const calculateEMI = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseInt(tenure);
    
    if (rate === 0) return principal / months;
    
    const emi = (principal * rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * parseInt(tenure);
  const totalInterest = totalAmount - parseFloat(loanAmount);

  const loanOffers = [
    {
      id: 1,
      bank: "HealthFirst Bank",
      amount: "₹5,00,000",
      interestRate: "10.5%",
      tenure: "24 months",
      emi: "₹23,200",
      features: ["No Collateral", "Quick Approval", "Flexible Repayment"],
      rating: 4.8,
      processingFee: "1%"
    },
    {
      id: 2,
      bank: "MediCare Finance",
      amount: "₹10,00,000",
      interestRate: "11.2%",
      tenure: "36 months",
      emi: "₹32,800",
      features: ["Zero Documentation", "Instant Disbursal", "Pre-approved Offers"],
      rating: 4.6,
      processingFee: "0.5%"
    },
    {
      id: 3,
      bank: "Wellness Capital",
      amount: "₹3,00,000",
      interestRate: "9.8%",
      tenure: "18 months",
      emi: "₹18,500",
      features: ["Low Interest", "No Prepayment Charges", "Online Application"],
      rating: 4.9,
      processingFee: "1.5%"
    },
    {
      id: 4,
      bank: "HealthPlus Credit",
      amount: "₹7,50,000",
      interestRate: "12.0%",
      tenure: "30 months",
      emi: "₹29,600",
      features: ["High Loan Amount", "Flexible Tenure", "Insurance Coverage"],
      rating: 4.7,
      processingFee: "2%"
    },
    {
      id: 5,
      bank: "QuickMed Loans",
      amount: "₹2,00,000",
      interestRate: "13.5%",
      tenure: "12 months",
      emi: "₹18,000",
      features: ["Same Day Approval", "Minimal Documentation", "Emergency Loans"],
      rating: 4.5,
      processingFee: "0.8%"
    },
    {
      id: 6,
      bank: "Family Health Finance",
      amount: "₹15,00,000",
      interestRate: "11.8%",
      tenure: "48 months",
      emi: "₹39,200",
      features: ["Family Coverage", "Long Tenure", "Competitive Rates"],
      rating: 4.8,
      processingFee: "1.2%"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <IndianRupee className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Loan Assistance</h1>
              <p className="text-gray-600 dark:text-gray-300">Access medical loans and financing options for your healthcare needs</p>
            </div>
          </div>
          
          {/* Coming Soon Badge */}
          <Badge variant="outline" className="bg-orange-100 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800">
            <Clock className="h-3 w-3 mr-1" />
            Coming Soon
          </Badge>
        </div>

        {/* EMI Calculator */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                EMI Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="loanAmount">Loan Amount (₹)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="500000"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Interest Rate (% per annum)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="12"
                    disabled
                  />
                </div>
                <div>
                  <Label htmlFor="tenure">Tenure (months)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="24"
                    disabled
                  />
                </div>
              </div>
              
              {/* EMI Results */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monthly EMI</p>
                    <p className="text-2xl font-bold text-blue-600">₹{emi.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
                    <p className="text-2xl font-bold text-green-600">₹{totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Interest</p>
                    <p className="text-2xl font-bold text-red-600">₹{totalInterest.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Loan Offers */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Available Medical Loan Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanOffers.map((offer) => (
              <Card key={offer.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{offer.bank}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Medical Loan</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm font-medium">{offer.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Loan Details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <IndianRupee className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Max Amount</p>
                        <p className="font-semibold text-blue-900 dark:text-blue-100">{offer.amount}</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <Percent className="h-5 w-5 text-green-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Interest Rate</p>
                        <p className="font-semibold text-green-900 dark:text-green-100">{offer.interestRate}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">Tenure</p>
                        <p className="font-semibold text-purple-900 dark:text-purple-100">{offer.tenure}</p>
                      </div>
                      <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <Calculator className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-gray-600 dark:text-gray-400">EMI</p>
                        <p className="font-semibold text-orange-900 dark:text-orange-100">{offer.emi}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Features:</p>
                      <div className="space-y-1">
                        {offer.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Processing Fee: {offer.processingFee}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Our Loan Partners */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Why Choose Our Loan Partners?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Secure & Trusted</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Verified financial institutions</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Quick Approval</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Fast loan processing</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">Competitive Rates</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Best interest rates</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coming Soon Notice */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Loan Integration Coming Soon
            </h3>
            <p className="text-blue-700 dark:text-blue-300">
              We're partnering with leading financial institutions to provide you with easy access to medical loans and financing options.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Loans;
