import React, { useState, useEffect } from 'react';
import { X, Brain, AlertTriangle, CheckCircle, Clock, User, Shield, Heart } from 'lucide-react';
import { 
  getMRICTAnalysis, 
  updateDoctorAccess, 
  getRiskLevelColor, 
  getScanTypeIcon,
  type MRI_CT_Analysis 
} from '../../services/mriCtAnalysisService';

interface MRIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string;
  patientId: string;
  userRole: 'patient' | 'doctor';
}

export const MRIAnalysisModal: React.FC<MRIAnalysisModalProps> = ({
  isOpen,
  onClose,
  recordId,
  patientId,
  userRole
}) => {
  const [analysis, setAnalysis] = useState<MRI_CT_Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingAccess, setUpdatingAccess] = useState(false);

  useEffect(() => {
    if (isOpen && recordId) {
      fetchAnalysis();
    }
  }, [isOpen, recordId]);

  const fetchAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getMRICTAnalysis(recordId);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDoctorAccess = async (doctorAccess: boolean) => {
    if (!analysis) return;
    
    setUpdatingAccess(true);
    try {
      const updatedAnalysis = await updateDoctorAccess(recordId, doctorAccess);
      setAnalysis(updatedAnalysis);
    } catch (err) {
      console.error('Failed to update doctor access:', err);
    } finally {
      setUpdatingAccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Brain className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {analysis ? `${analysis.scan_type_display} Analysis` : 'MRI/CT Analysis'}
              </h2>
              <p className="text-sm text-gray-500">
                AI-powered radiology analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading analysis...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Analysis</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={fetchAnalysis}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              {/* Analysis Header */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getScanTypeIcon(analysis.scan_type)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">{analysis.scan_type_display}</h3>
                      <p className="text-sm text-gray-600">Region: {analysis.region}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getRiskLevelColor(analysis.risk_level)}`}>
                    {analysis.risk_level_display} Risk
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Brain className="h-4 w-4" />
                    <span>Model: {analysis.source_model}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>Analysis Summary</span>
                </h4>
                <p className="text-blue-800 leading-relaxed">{analysis.summary}</p>
              </div>

              {/* Simplified Summary */}
              {analysis.simplifiedSummary && (
                <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Simplified Summary</span>
                  </h4>
                  <p className="text-green-800 leading-relaxed">{analysis.simplifiedSummary}</p>
                </div>
              )}

              {/* Findings */}
              {analysis.findings && analysis.findings.length > 0 && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span>Key Findings</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysis.findings.map((finding, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span className="text-yellow-800">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Clinical Significance */}
              {analysis.clinical_significance && (
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2 flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>Clinical Significance</span>
                  </h4>
                  <p className="text-purple-800 leading-relaxed">{analysis.clinical_significance}</p>
                </div>
              )}

              {/* Recommendations */}
              {analysis.recommendations && analysis.recommendations.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5" />
                    <span>Recommendations</span>
                  </h4>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-green-800">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Doctor Access Control (for patients) */}
              {userRole === 'patient' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Doctor Access</span>
                  </h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-700">
                        Allow doctors to view this analysis
                      </p>
                      <p className="text-sm text-gray-500">
                        This helps doctors provide better care by understanding your scan results
                      </p>
                    </div>
                    <button
                      onClick={() => handleUpdateDoctorAccess(!analysis.doctor_access)}
                      disabled={updatingAccess}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        analysis.doctor_access
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } ${updatingAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {updatingAccess ? 'Updating...' : analysis.doctor_access ? 'Enabled' : 'Enable'}
                    </button>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Important Disclaimer</span>
                </h4>
                <p className="text-red-800 text-sm leading-relaxed">
                  {analysis.disclaimer}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MRIAnalysisModal;
