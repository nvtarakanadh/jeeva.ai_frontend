// AI Analysis Service that connects to Django backend
// This replaces the old complex frontend AI analysis with backend integration
import { supabase } from '@/integrations/supabase/client';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://127.0.0.1:8000/api/ai';

export interface AIAnalysisResult {
  summary: string;
  keyFindings: string[];
  riskWarnings: string[];
  recommendations: string[];
  predictiveInsights?: string[];
  ai_disclaimer?: string;
  disclaimer?: string;
  confidence: number;
  analysisType?: string;  // Frontend field name
  analysis_type?: string; // Django field name
}

export interface HealthRecordAnalysisRequest {
  title: string;
  description?: string;
  record_type: string;
  service_date: string;
  file_url?: string;
  file_name?: string;
  record_id?: string;
  patient_id?: string;
  uploaded_by?: string;
}

export interface PrescriptionAnalysisRequest {
  image: File;
  title?: string;
  description?: string;
  recordType?: string;
  patientId?: string;
  uploadedBy?: string;
}

export interface MedicalReportAnalysisRequest {
  file: File;
  title?: string;
  description?: string;
  patientId?: string;
  uploadedBy?: string;
}

export interface AnalysisResponse {
  success: boolean;
  record_id: string;
  analysis: AIAnalysisResult;
  health_record?: any;
}

/**
 * Analyze a prescription image using the Django backend
 */
export const analyzePrescription = async (request: PrescriptionAnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('image', request.image);
    formData.append('title', request.title || 'Prescription Analysis');
    formData.append('description', request.description || '');
    formData.append('record_type', request.recordType || 'prescription');
    if (request.patientId) formData.append('patient_id', request.patientId);
    if (request.uploadedBy) formData.append('uploaded_by', request.uploadedBy);

    const response = await fetch(`${API_BASE_URL}/analyze/prescription/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze prescription');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing prescription:', error);
    throw error;
  }
};

/**
 * Analyze a medical report (PDF or image) using the Django backend
 */
export const analyzeMedicalReport = async (request: MedicalReportAnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const formData = new FormData();
    formData.append('file', request.file);
    formData.append('title', request.title || 'Medical Report Analysis');
    formData.append('description', request.description || '');
    if (request.patientId) formData.append('patient_id', request.patientId);
    if (request.uploadedBy) formData.append('uploaded_by', request.uploadedBy);

    const response = await fetch(`${API_BASE_URL}/analyze/medical-report/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze medical report');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing medical report:', error);
    throw error;
  }
};

/**
 * Analyze a health record using the Django backend
 */
export const analyzeHealthRecord = async (request: HealthRecordAnalysisRequest): Promise<AnalysisResponse> => {
  try {
    console.log('🔍 Calling Django backend with request:', request);
    console.log('🔍 API URL:', `${API_BASE_URL}/analyze/health-record/`);
    
    const response = await fetch(`${API_BASE_URL}/analyze/health-record/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Backend error response:', errorData);
      console.error('❌ Full error details:', JSON.stringify(errorData, null, 2));
      throw new Error(errorData.error || 'Failed to analyze health record');
    }

    const result = await response.json();
    console.log('✅ Backend success response:', result);
    return result;
  } catch (error) {
    console.error('❌ Error analyzing health record:', error);
    console.error('❌ Error type:', typeof error);
    console.error('❌ Error message:', error.message);
    throw error;
  }
};

/**
 * Get AI analysis for a specific record
 */
export const getAnalysis = async (recordId: string): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${recordId}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get analysis');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting analysis:', error);
    throw error;
  }
};

/**
 * List all AI analyses
 */
export const listAnalyses = async (): Promise<{ success: boolean; analyses: AIAnalysisResult[] }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to list analyses');
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing analyses:', error);
    throw error;
  }
};

/**
 * Health check for the AI backend
 */
export const healthCheck = async (): Promise<{ status: string; message: string; timestamp: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Backend health check failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking backend health:', error);
    throw error;
  }
};

/**
 * Legacy function for backward compatibility
 * This now uses the Django backend instead of complex frontend analysis
 */
export const analyzeHealthRecordWithAI = async (recordData: {
  title: string;
  description: string;
  recordType: string;
  serviceDate: string;
  fileUrl?: string;
  fileName?: string;
  recordId?: string;
  patientId?: string;
  uploadedBy?: string;
}): Promise<AIAnalysisResult> => {
  try {
    // Get current user ID from Supabase
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id || 'unknown-user';
    
    // Route to the correct analysis endpoint based on record type
    let response;
    
    if (recordData.recordType === 'lab_test' || recordData.recordType === 'medical_report' || recordData.recordType === 'lab-result') {
      // For lab tests and medical reports, we need to download the file and analyze it
      if (recordData.fileUrl) {
        // Download the file and analyze it as a medical report
        const fileResponse = await fetch(recordData.fileUrl);
        const fileBlob = await fileResponse.blob();
        const file = new File([fileBlob], recordData.fileName || 'medical_report', { type: fileBlob.type });
        
        response = await analyzeMedicalReport({
          file: file,
          title: recordData.title,
          description: recordData.description,
          patientId: recordData.patientId || currentUserId,
          uploadedBy: recordData.uploadedBy || currentUserId
        });
      } else {
        throw new Error('No file URL provided for medical report analysis');
      }
    } else {
      // For other record types, use the general health record analysis
      response = await analyzeHealthRecord({
        title: recordData.title,
        description: recordData.description,
        record_type: recordData.recordType,
        service_date: recordData.serviceDate,
        file_url: recordData.fileUrl,
        file_name: recordData.fileName,
        record_id: recordData.recordId,
        patient_id: recordData.patientId || currentUserId,
        uploaded_by: recordData.uploadedBy || currentUserId
      });
    }

    return response.analysis;
  } catch (error) {
    console.error('Error in legacy analyzeHealthRecordWithAI:', error);
    console.error('Error details:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Backend is not available - throw error to be handled by caller
    throw new Error('Backend AI analysis service is not available. Please check if the Django server is running on port 8000.');
  }
};