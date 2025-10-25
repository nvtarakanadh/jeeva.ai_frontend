import React, { useState } from 'react';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { 
  analyzeMRICTScan, 
  hasMRICTAnalysis, 
  getScanTypeIcon,
  type MRI_CT_AnalysisRequest 
} from '../../services/mriCtAnalysisService';

interface MRIAnalysisButtonProps {
  recordId: string;
  patientId: string;
  scanType: 'MRI' | 'CT' | 'XRAY';
  imageUrl?: string;
  imageFile?: File;
  onAnalysisComplete?: (analysis: any) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const MRIAnalysisButton: React.FC<MRIAnalysisButtonProps> = ({
  recordId,
  patientId,
  scanType,
  imageUrl,
  imageFile,
  onAnalysisComplete,
  onError,
  className = ''
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if analysis already exists
  React.useEffect(() => {
    const checkExistingAnalysis = async () => {
      try {
        const exists = await hasMRICTAnalysis(recordId);
        setHasAnalysis(exists);
      } catch (err) {
        console.error('Error checking existing analysis:', err);
      }
    };

    if (recordId) {
      checkExistingAnalysis();
    }
  }, [recordId]);

  const handleAnalyze = async () => {
    if (!imageUrl && !imageFile) {
      const errorMsg = 'No image provided for analysis';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const request: MRI_CT_AnalysisRequest = {
        record_id: recordId,
        patient_id: patientId,
        scan_type: scanType,
        image_url: imageUrl,
        image_file: imageFile,
        doctor_access: false
      };

      console.log('🔍 Starting MRI/CT analysis:', request);
      
      const result = await analyzeMRICTScan(request);
      
      console.log('✅ MRI/CT analysis completed:', result);
      
      setHasAnalysis(true);
      onAnalysisComplete?.(result.analysis);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
      console.error('❌ MRI/CT analysis error:', errorMsg);
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getButtonText = () => {
    if (isAnalyzing) return 'Analyzing...';
    if (hasAnalysis) return 'View Analysis';
    return `Analyze ${scanType}`;
  };

  const getButtonIcon = () => {
    if (isAnalyzing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (hasAnalysis) {
      return <Brain className="h-4 w-4" />;
    }
    return <Brain className="h-4 w-4" />;
  };

  const getButtonVariant = () => {
    if (hasAnalysis) return 'success';
    if (error) return 'error';
    return 'primary';
  };

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (getButtonVariant()) {
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 ${className}`;
      case 'error':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 ${className}`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 ${className}`;
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleAnalyze}
        disabled={isAnalyzing || (!imageUrl && !imageFile)}
        className={getButtonClasses()}
      >
        <span className="text-lg">{getScanTypeIcon(scanType)}</span>
        {getButtonIcon()}
        <span>{getButtonText()}</span>
      </button>
      
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
      
      {!imageUrl && !imageFile && (
        <p className="text-sm text-gray-500">
          Upload an image to enable analysis
        </p>
      )}
    </div>
  );
};

export default MRIAnalysisButton;
