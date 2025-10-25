import React, { useState } from 'react';
import { Brain, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HealthRecord } from '@/types';
import { analyzeHealthRecordWithAI } from '@/services/aiAnalysisService';
import { 
  analyzeMRICTScan, 
  hasMRICTAnalysis, 
  getScanTypeIcon,
  type MRI_CT_AnalysisRequest 
} from '@/services/mriCtAnalysisService';
import AIAnalysisModal from './AIAnalysisModal';
import MRIAnalysisModal from './MRIAnalysisModal';

interface HealthRecordAIAnalysisProps {
  record: HealthRecord;
  userRole: 'patient' | 'doctor';
  onAnalysisComplete?: (analysis: any) => void;
  onError?: (error: string) => void;
}

export const HealthRecordAIAnalysis: React.FC<HealthRecordAIAnalysisProps> = ({
  record,
  userRole,
  onAnalysisComplete,
  onError
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMRIModalOpen, setIsMRIModalOpen] = useState(false);
  const [hasMRIAnalysis, setHasMRIAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if this is an imaging record that supports MRI/CT analysis
  const isImagingRecord = record.recordType === 'imaging' && 
    (record.fileName?.toLowerCase().includes('mri') || 
     record.fileName?.toLowerCase().includes('ct') || 
     record.fileName?.toLowerCase().includes('xray') ||
     record.title?.toLowerCase().includes('mri') ||
     record.title?.toLowerCase().includes('ct') ||
     record.title?.toLowerCase().includes('xray'));

  // Determine scan type from record
  const getScanType = (): 'MRI' | 'CT' | 'XRAY' => {
    const title = record.title?.toLowerCase() || '';
    const fileName = record.fileName?.toLowerCase() || '';
    
    if (title.includes('mri') || fileName.includes('mri')) return 'MRI';
    if (title.includes('ct') || fileName.includes('ct')) return 'CT';
    if (title.includes('xray') || fileName.includes('xray') || title.includes('x-ray')) return 'XRAY';
    
    // Default based on common patterns
    return 'MRI';
  };

  // Check for existing MRI/CT analysis
  React.useEffect(() => {
    if (isImagingRecord) {
      const checkMRIAnalysis = async () => {
        try {
          const exists = await hasMRICTAnalysis(record.id);
          setHasMRIAnalysis(exists);
        } catch (err) {
          console.error('Error checking MRI analysis:', err);
        }
      };
      checkMRIAnalysis();
    }
  }, [record.id, isImagingRecord]);

  const handleRegularAIAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisData = {
        title: record.title,
        description: record.description || '',
        record_type: record.recordType,
        service_date: record.recordDate,
        file_url: record.fileUrl || '',
        file_name: record.fileName || '',
        patient_id: record.patientId,
        uploaded_by: record.uploadedBy,
        record_id: record.id
      };

      await analyzeHealthRecordWithAI(analysisData);
      setIsAIModalOpen(true);
      onAnalysisComplete?.('regular');
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMRICTAnalysis = async () => {
    if (hasMRIAnalysis) {
      setIsMRIModalOpen(true);
      return;
    }

    if (!record.fileUrl) {
      const errorMsg = 'No image file available for MRI/CT analysis';
      setError(errorMsg);
      onError?.(errorMsg);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const scanType = getScanType();
      const request: MRI_CT_AnalysisRequest = {
        record_id: record.id,
        patient_id: record.patientId,
        scan_type: scanType,
        image_url: record.fileUrl,
        doctor_access: false
      };

      const result = await analyzeMRICTScan(request);
      setHasMRIAnalysis(true);
      setIsMRIModalOpen(true);
      onAnalysisComplete?.(result.analysis);
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'MRI/CT analysis failed';
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getButtonText = () => {
    if (isAnalyzing) return 'Analyzing...';
    if (isImagingRecord && hasMRIAnalysis) return 'View MRI/CT Analysis';
    if (isImagingRecord) return `Analyze ${getScanType()}`;
    return 'AI Analytics';
  };

  const getButtonIcon = () => {
    if (isAnalyzing) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (isImagingRecord) {
      return <span className="text-lg">{getScanTypeIcon(getScanType())}</span>;
    }
    return <Brain className="h-4 w-4" />;
  };

  const handleButtonClick = () => {
    if (isImagingRecord) {
      handleMRICTAnalysis();
    } else {
      handleRegularAIAnalysis();
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Button
          onClick={handleButtonClick}
          disabled={isAnalyzing}
          className="flex-1 sm:flex-none lg:flex-none justify-center sm:justify-start lg:justify-start h-10 sm:h-8 lg:h-8 touch-manipulation"
        >
          {getButtonIcon()}
          <span className="ml-2 hidden sm:inline">{getButtonText()}</span>
          <span className="ml-2 sm:hidden">{getButtonText()}</span>
        </Button>
        
        {error && (
          <div className="flex items-center space-x-2 text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {isImagingRecord && (
          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
            🧠 Enhanced AI analysis available for {getScanType()} scans
          </div>
        )}
      </div>

      {/* Regular AI Analysis Modal */}
      <AIAnalysisModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        recordId={record.id}
        userRole={userRole}
      />

      {/* MRI/CT Analysis Modal */}
      <MRIAnalysisModal
        isOpen={isMRIModalOpen}
        onClose={() => setIsMRIModalOpen(false)}
        recordId={record.id}
        patientId={record.patientId}
        userRole={userRole}
      />
    </>
  );
};

export default HealthRecordAIAnalysis;
