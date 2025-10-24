import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Activity, AlertTriangle, Lightbulb, TrendingUp, X, RefreshCw, AlertCircle, Upload, FileText, FileImage } from 'lucide-react';
import { InlineLoadingSpinner } from '@/components/ui/loading-spinner';
import { analyzeMedicalReport, AIAnalysisResult } from '@/services/aiAnalysisService';

interface MedicalReportAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete?: (result: AIAnalysisResult) => void;
}

export const MedicalReportAnalysisModal: React.FC<MedicalReportAnalysisModalProps> = ({
  isOpen,
  onClose,
  onAnalysisComplete
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeMedicalReport({
        file: selectedFile,
        title: 'Medical Report Analysis',
        description: 'AI analysis of medical report',
        patientId: 'current-user', // You might want to get this from context
        uploadedBy: 'current-user'
      });

      if (response.success) {
        setAnalysis(response.analysis);
        setRecordId(response.record_id);
        
        // Call the callback if provided
        if (onAnalysisComplete) {
          onAnalysisComplete(response.analysis);
        }
      } else {
        setError('Analysis failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Error analyzing medical report:', error);
      setError(`Analysis failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setAnalysis(null);
    setError(null);
    setRecordId(null);
    onClose();
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.toLowerCase().split('.').pop();
    if (extension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (['png', 'jpg', 'jpeg', 'tiff', 'bmp'].includes(extension || '')) {
      return <FileImage className="h-8 w-8 text-blue-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-indigo-600" />
            AI Medical Report Analysis
          </DialogTitle>
          <DialogDescription>
            AI-powered analysis of your medical report with key findings, risk assessment, and recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Upload Section */}
          {!analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Upload Medical Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Upload a medical report (PDF or image)
                    </p>
                    <p className="text-xs text-gray-500 mb-4">
                      Supports PDF, PNG, JPG, JPEG, TIFF, BMP files
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,.tiff,.bmp"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="medical-report-upload"
                    />
                    <label
                      htmlFor="medical-report-upload"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                  
                  {selectedFile && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(selectedFile.name)}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">
                            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleAnalyze}
                    disabled={!selectedFile || isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <InlineLoadingSpinner />
                        <span className="ml-2">Analyzing Medical Report...</span>
                      </>
                    ) : (
                      'Analyze Medical Report'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <InlineLoadingSpinner />
              <span className="ml-2">Analyzing medical report with AI...</span>
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-red-600">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => setError(null)}
                    className="mt-4"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
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
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getConfidenceColor(analysis.confidence)}
                      >
                        {getConfidenceLabel(analysis.confidence)} Confidence
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Confidence Score */}
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Confidence Score</span>
                        <span>{Math.round(analysis.confidence * 100)}%</span>
                      </div>
                      <Progress value={analysis.confidence * 100} className="h-2" />
                    </div>

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

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            {analysis && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedFile(null);
                  setAnalysis(null);
                  setError(null);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyze Another
              </Button>
            )}
            <Button variant="outline" onClick={handleClose}>
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalReportAnalysisModal;
