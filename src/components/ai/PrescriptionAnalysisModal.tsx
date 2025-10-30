import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Activity, AlertTriangle, Lightbulb, TrendingUp, X, RefreshCw, AlertCircle, Upload } from 'lucide-react';
import { InlineLoadingSpinner } from '@/components/ui/loading-spinner';
import { analyzePrescription, AIAnalysisResult, getAIAnalysisForRecord } from '@/services/aiAnalysisService';
import { Prescription } from '@/services/prescriptionService';
import { useEffect } from 'react';

interface PrescriptionAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
}

export const PrescriptionAnalysisModal: React.FC<PrescriptionAnalysisModalProps> = ({
  isOpen,
  onClose,
  prescription,
  onAnalysisComplete,
}) => {
  // If closed or no prescription, render nothing
  if (!isOpen || !prescription) return null;

  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    const fetchAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await getAIAnalysisForRecord(prescription.id);
        if (!ignore) setAnalysis(result);
      } catch (err: any) {
        if (!ignore) setError(err.message || 'Failed to fetch AI analysis.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    fetchAnalysis();
    return () => {
      ignore = true;
    };
  }, [prescription.id]);

  const handleClose = () => {
    setAnalysis(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            AI Prescription Analysis
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your prescription. This is the automatically generated result.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <InlineLoadingSpinner />
              <span className="ml-2">Loading AI analysis for this prescription...</span>
            </div>
          )}
          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>{error}</p>
                </div>
              </CardContent>
            </Card>
          )}
          {analysis && (
            <div className="space-y-4">
              {/* Analysis Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">AI Analysis Results</CardTitle>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Summary */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Summary
                      </h4>
                      <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md whitespace-pre-wrap">
                        {analysis.summary}
                      </div>
                    </div>

                    {/* Key Findings */}
                    {analysis.keyFindings && analysis.keyFindings.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Key Findings
                        </h4>
                        <ul className="space-y-1">
                          {analysis.keyFindings.map((finding, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-indigo-600 mt-1">•</span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Risk Warnings */}
                    {analysis.riskWarnings && analysis.riskWarnings.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-4 w-4" />
                          Risk Warnings
                        </h4>
                        <ul className="space-y-1">
                          {analysis.riskWarnings.map((warning, index) => (
                            <li key={index} className="text-sm text-red-700 bg-red-50 p-2 rounded-md flex items-start gap-2">
                              <span className="text-red-600 mt-1">⚠</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {analysis.recommendations && analysis.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-green-600">
                          <TrendingUp className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {analysis.recommendations.map((recommendation, index) => (
                            <li key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded-md flex items-start gap-2">
                              <span className="text-green-600 mt-1">💡</span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Predictive Insights */}
                    {analysis.predictiveInsights && analysis.predictiveInsights.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-600">
                          <Activity className="h-4 w-4" />
                          Predictive Insights
                        </h4>
                        <ul className="space-y-1">
                          {analysis.predictiveInsights.map((insight, index) => (
                            <li key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded-md flex items-start gap-2">
                              <span className="text-blue-600 mt-1">🔮</span>
                              {insight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* AI Disclaimer */}
                    {analysis.ai_disclaimer && (
                      <div>
                        <h4 className="font-medium mb-2 flex items-center gap-2 text-orange-600">
                          <AlertTriangle className="h-4 w-4" />
                          AI Analysis Disclaimer
                        </h4>
                        <div className="text-sm text-orange-700 bg-orange-50 p-3 rounded-md border-l-4 border-orange-200">
                          {analysis.ai_disclaimer}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          {!isLoading && !error && !analysis && (
            <div className="flex flex-col items-center py-12 opacity-70">
              <Brain className="h-12 w-12 text-indigo-400 mb-4" />
              <span>AI analysis is being processed or not yet available for this prescription.</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionAnalysisModal;
