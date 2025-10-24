// AI Analysis Service that connects to Django backend
// This replaces the old complex frontend AI analysis with backend integration

// Railway URL configuration - Your actual Railway URL
const RAILWAY_BACKEND_URL = 'https://web-production-47a17.up.railway.app/api/ai';

// Determine the correct API URL based on environment
const getAPIBaseURL = () => {
  // Check if we're in production (Vercel)
  const isProduction = window.location.hostname.includes('vercel.app') || 
                      window.location.hostname.includes('netlify.app') ||
                      !window.location.hostname.includes('localhost');
  
  if (isProduction) {
    // Use Railway backend URL
    return RAILWAY_BACKEND_URL;
  }
  
  // Development fallback
  return 'http://127.0.0.1:8000/api/ai';
};

const API_BASE_URL = getAPIBaseURL();

export interface AIAnalysisResult {
  summary: string;
  keyFindings: string[];
  riskWarnings: string[];
  recommendations: string[];
  confidence: number;
  analysisType: string;
}

export interface HealthRecordAnalysisRequest {
  title: string;
  description?: string;
  recordType: string;
  serviceDate: string;
  fileUrl?: string;
  fileName?: string;
  patientId?: string;
  uploadedBy?: string;
}

export interface PrescriptionAnalysisRequest {
  image: File;
  title?: string;
  description?: string;
  recordType?: string;
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
 * Analyze a health record using the Django backend
 */
export const analyzeHealthRecord = async (request: HealthRecordAnalysisRequest): Promise<AnalysisResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze/health-record/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to analyze health record');
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing health record:', error);
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