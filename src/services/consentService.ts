import { supabase } from '@/integrations/supabase/client';
import { ConsentRequest, ConsentStatus, RecordType } from '@/types';
import { 
  createConsentRequestNotification,
  createConsentApprovedNotification,
  createConsentDeniedNotification,
  createRecordAccessNotification
} from './notificationService';

export interface ConsentRequestData {
  patientId: string;
  doctorId: string;
  purpose: string;
  requestedDataTypes: RecordType[];
  duration: number;
  message?: string;
}

export interface ConsentResponseData {
  status: 'approved' | 'denied';
  dataTypes?: RecordType[];
}

// Helper function to get doctor name
const getDoctorName = async (doctorProfileId: string): Promise<string> => {
  const { data: doctorProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', doctorProfileId)
    .single();
  
  return doctorProfile?.full_name || 'Unknown Doctor';
};

// Get consent forms from health_records table
export const getConsentFormsFromHealthRecords = async (doctorProfileId?: string, patientUserId?: string): Promise<ConsentRequest[]> => {
  try {
    let query = supabase
      .from('health_records')
      .select('*')
      .contains('tags', ['consent_form'])
      .eq('record_type', 'consultation')
      .order('created_at', { ascending: false });

    // Filter by patient user_id if provided
    if (patientUserId) {
      query = query.eq('user_id', patientUserId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching health records:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get doctor profile if doctorProfileId is provided (for filtering)
    let doctorProfile = null;
    if (doctorProfileId) {
      const { data: doctor } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('id', doctorProfileId)
        .single();
      doctorProfile = doctor;
    }

    // Get patient user IDs
    const patientUserIds = new Set(data.map(r => r.user_id));
    
    // Get patient profiles
    const { data: patientProfiles } = await supabase
      .from('profiles')
      .select('id, user_id, full_name')
      .in('user_id', Array.from(patientUserIds));

    const patientMap = new Map(patientProfiles?.map(p => [p.user_id, p]) || []);

    // Get all unique doctor IDs from metadata to fetch their names in batch
    const doctorIds = new Set<string>();
    data.forEach(record => {
      try {
        const description = record.description || '';
        const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
        if (metadataMatch) {
          const metadata = JSON.parse(metadataMatch[1]);
          if (metadata.doctor_id) {
            doctorIds.add(metadata.doctor_id);
          }
        }
      } catch (e) {
        // Skip if metadata parsing fails
      }
    });

    // Fetch all doctor profiles in batch
    const doctorProfilesMap = new Map<string, string>();
    if (doctorIds.size > 0) {
      const { data: doctorProfiles } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', Array.from(doctorIds));
      
      doctorProfiles?.forEach((doc: any) => {
        if (doc.full_name) {
          doctorProfilesMap.set(doc.id, doc.full_name);
        }
      });
    }

    // Process records and filter by doctor if needed
    const consentForms = data
      .map(record => {
        const patientProfile = patientMap.get(record.user_id);
        
        // Parse metadata from description
        let metadata: any = {};
        try {
          const description = record.description || '';
          const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
          if (metadataMatch) {
            metadata = JSON.parse(metadataMatch[1]);
          }
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }

        // If filtering by doctor, check if this record was created by that doctor
        // We match by provider_name or by checking if doctorProfileId matches
        if (doctorProfileId && doctorProfile) {
          // Check if provider_name matches doctor's name
          const providerMatches = record.provider_name === doctorProfile.full_name;
          if (!providerMatches) {
            return null; // Skip this record if it doesn't match the doctor
          }
        }

        // Determine requester name - prioritize provider_name, then doctorProfile, then doctorProfilesMap
        let requesterName = record.provider_name || 'Unknown Doctor';
        if (!requesterName || requesterName === 'Unknown Doctor') {
          if (doctorProfile?.full_name) {
            requesterName = doctorProfile.full_name;
          } else if (metadata.doctor_id && doctorProfilesMap.has(metadata.doctor_id)) {
            requesterName = doctorProfilesMap.get(metadata.doctor_id)!;
          }
        }

        return {
          id: record.id,
          patientId: metadata.patient_id || patientProfile?.id || record.user_id,
          patientName: metadata.patient_name || patientProfile?.full_name || 'Unknown Patient',
          requesterId: doctorProfileId || metadata.doctor_id || '',
          requesterName: requesterName,
          purpose: record.title,
          requestedDataTypes: ['health_records'] as RecordType[],
          duration: metadata.duration_days || 30,
          status: (metadata.status === 'pending' ? 'pending' : 'approved') as ConsentStatus, // Check metadata for status, default to approved for backward compatibility
          requestedAt: new Date(record.created_at),
          expiresAt: metadata.expires_at ? new Date(metadata.expires_at) : undefined,
          message: undefined
        };
      })
      .filter((form): form is ConsentRequest => form !== null);

    return consentForms;
  } catch (error) {
    console.error('Error fetching consent forms from health records:', error);
    throw error;
  }
};

// Get consent requests for a doctor
export const getDoctorConsentRequests = async (doctorProfileId: string): Promise<ConsentRequest[]> => {
  try {
    // Get both consent_requests and consent forms from health_records
    const [consentRequests, consentForms] = await Promise.all([
      // Get from consent_requests table
      (async () => {
        const { data, error } = await supabase
          .from('consent_requests')
          .select('*')
          .eq('doctor_id', doctorProfileId)
          .order('requested_at', { ascending: false });

        if (error) throw error;
        return data || [];
      })(),
      // Get consent forms from health_records
      getConsentFormsFromHealthRecords(doctorProfileId)
    ]);

    const allData = [...consentRequests, ...consentForms];

    if (allData.length === 0) {
      return [];
    }

    // Process consent_requests (from consent_requests table)
    const consentRequestsData = consentRequests.map((request: any) => {
      // This will be processed below
      return request;
    });

    // Get doctor names for all requests
    // Collect doctor IDs from both consent_requests (doctor_id) and consentForms (requesterId)
    const doctorIdsFromRequests = consentRequests.map((r: any) => r.doctor_id).filter(Boolean);
    const doctorIdsFromForms = consentForms.map(r => r.requesterId).filter(Boolean);
    const allDoctorIds = [...new Set([...doctorIdsFromRequests, ...doctorIdsFromForms])];
    
    const { data: doctorProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', allDoctorIds);

    const doctorMap = new Map(doctorProfiles?.map(p => [p.id, p.full_name]) || []);

    // Get patient names for all requests
    const patientIdsFromRequests = consentRequests.map((r: any) => r.patient_id).filter(Boolean);
    const patientIdsFromForms = consentForms.map(r => r.patientId).filter(Boolean);
    const allPatientIds = [...new Set([...patientIdsFromRequests, ...patientIdsFromForms])];
    
    const { data: patientProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', allPatientIds);

    const patientMap = new Map(patientProfiles?.map(p => [p.id, p.full_name]) || []);

    // Process consent_requests from consent_requests table
    const processedConsentRequests = consentRequests.map((request: any) => ({
      id: request.id,
      patientId: request.patient_id,
      patientName: patientMap.get(request.patient_id) || 'Unknown Patient',
      requesterId: request.doctor_id,
      requesterName: doctorMap.get(request.doctor_id) || 'Unknown Doctor',
      purpose: request.purpose,
      requestedDataTypes: request.requested_data_types as RecordType[],
      duration: request.duration_days,
      status: request.status as ConsentStatus,
      requestedAt: new Date(request.requested_at),
      respondedAt: request.responded_at ? new Date(request.responded_at) : undefined,
      expiresAt: request.expires_at ? new Date(request.expires_at) : undefined,
      message: request.message
    }));

    // Combine both types
    return [...processedConsentRequests, ...consentForms].sort((a, b) => 
      b.requestedAt.getTime() - a.requestedAt.getTime()
    );
  } catch (error) {
    console.error('Error fetching doctor consent requests:', error);
    throw error;
  }
};

// Get consent requests for a patient
export const getPatientConsentRequests = async (patientId: string): Promise<ConsentRequest[]> => {
  try {
    // Get patient's user_id
    const { data: patientProfile } = await supabase
      .from('profiles')
      .select('id, user_id, full_name')
      .eq('id', patientId)
      .single();

    if (!patientProfile) {
      throw new Error('Patient profile not found');
    }

    // Get both consent_requests and consent forms from health_records
    const [consentRequests, consentForms] = await Promise.all([
      // Get from consent_requests table
      (async () => {
        const { data, error } = await supabase
          .from('consent_requests')
          .select('*')
          .eq('patient_id', patientId)
          .order('requested_at', { ascending: false });

        if (error) throw error;
        return data || [];
      })(),
      // Get consent forms from health_records
      getConsentFormsFromHealthRecords(undefined, patientProfile.user_id)
    ]);

    // Process consent_requests from consent_requests table
    const doctorIds = [...new Set(consentRequests.map((r: any) => r.doctor_id))];
    const { data: doctorProfiles } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', doctorIds);

    const doctorMap = new Map(doctorProfiles?.map(p => [p.id, p.full_name]) || []);

    const processedConsentRequests = consentRequests.map((request: any) => ({
      id: request.id,
      patientId: request.patient_id,
      patientName: patientProfile.full_name || 'Unknown Patient',
      requesterId: request.doctor_id,
      requesterName: doctorMap.get(request.doctor_id) || 'Unknown Doctor',
      purpose: request.purpose,
      requestedDataTypes: request.requested_data_types as RecordType[],
      duration: request.duration_days,
      status: request.status as ConsentStatus,
      requestedAt: new Date(request.requested_at),
      respondedAt: request.responded_at ? new Date(request.responded_at) : undefined,
      expiresAt: request.expires_at ? new Date(request.expires_at) : undefined,
      message: request.message
    }));

    // Combine both types
    return [...processedConsentRequests, ...consentForms].sort((a, b) => 
      b.requestedAt.getTime() - a.requestedAt.getTime()
    );
  } catch (error) {
    console.error('Error fetching patient consent requests:', error);
    throw error;
  }
};

// Create a new consent request
export const createConsentRequest = async (requestData: ConsentRequestData): Promise<ConsentRequest> => {
  try {
    console.log('Creating consent request with data:', requestData);
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      throw new Error('User not authenticated');
    }
    
    console.log('User authenticated:', user.id);
    
    // First, verify that the patient_id exists in profiles table
    const { data: patientProfile, error: patientError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', requestData.patientId)
      .single();
    
    if (patientError || !patientProfile) {
      console.error('Patient profile not found:', patientError);
      throw new Error(`Patient not found: ${requestData.patientId}`);
    }
    
    console.log('Patient profile verified:', patientProfile);
    
    // Verify that the doctor_id exists in profiles table
    const { data: doctorProfile, error: doctorError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('id', requestData.doctorId)
      .single();
    
    if (doctorError || !doctorProfile) {
      console.error('Doctor profile not found:', doctorError);
      throw new Error(`Doctor not found: ${requestData.doctorId}`);
    }
    
    console.log('Doctor profile verified:', doctorProfile);
    
    // Insert consent request with all required fields
    const insertData = {
      patient_id: requestData.patientId,
      doctor_id: requestData.doctorId,
      purpose: requestData.purpose,
      requested_data_types: requestData.requestedDataTypes,
      duration_days: requestData.duration,
      status: 'pending',
      message: requestData.message
    };
    
    console.log('Inserting data:', insertData);
    
    const { data, error } = await supabase
      .from('consent_requests')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log('Successfully created consent:', data);

    // Get doctor name from profiles table
    const doctorName = await getDoctorName(data.doctor_id);

    // Get patient user_id for notification
    const { data: patientUser, error: patientUserError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', data.patient_id)
      .single();

    // Create notification for patient about consent request
    if (patientUser && !patientUserError) {
      await createConsentRequestNotification(
        patientUser.user_id,
        data.patient_id,
        doctorName
      );
    }

    return {
      id: data.id,
      patientId: data.patient_id,
      requesterId: data.doctor_id,
      requesterName: doctorName,
      purpose: data.purpose,
      requestedDataTypes: data.requested_data_types as RecordType[],
      duration: data.duration_days,
      status: data.status as ConsentStatus,
      requestedAt: new Date(data.requested_at),
      respondedAt: data.responded_at ? new Date(data.responded_at) : undefined,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      message: data.message
    };
  } catch (error) {
    console.error('Error creating consent request:', error);
    throw error;
  }
};

// Respond to a consent request
export const respondToConsentRequest = async (
  requestId: string, 
  response: ConsentResponseData
): Promise<ConsentRequest> => {
  try {
    // First, get the original request to understand what access was requested
    const { data: originalRequest, error: fetchError } = await supabase
      .from('consent_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;

    const updateData: any = {
      status: response.status === 'approved' ? 'approved' : 'denied',
      responded_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (response.status === 'approved') {
      // Set expiration date based on duration (default 7 days)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (originalRequest.duration_days || 7));
      updateData.expires_at = expiresAt.toISOString();
    }

    // Update the consent request
    const { data, error } = await supabase
      .from('consent_requests')
      .update(updateData)
      .eq('id', requestId)
      .select('*')
      .single();

    if (error) throw error;

    // If approved, create patient_access records for each requested data type
    if (response.status === 'approved') {
      console.log('Creating patient access records for approved consent:', {
        patientId: originalRequest.patient_id,
        doctorId: originalRequest.doctor_id,
        requestedDataTypes: originalRequest.requested_data_types,
        expiresAt: updateData.expires_at
      });

      // Map data types to access types
      const accessTypeMap: Record<string, string> = {
        'health_records': 'view_records',
        'prescriptions': 'view_prescriptions', 
        'consultation_notes': 'view_consultation_notes',
        'all': 'all'
      };

      // Create access records for each requested data type
      for (const dataType of originalRequest.requested_data_types || []) {
        const accessType = accessTypeMap[dataType] || 'view_records';
        
        const { error: accessError } = await supabase
          .from('patient_access')
          .insert({
            patient_id: originalRequest.patient_id,
            doctor_id: originalRequest.doctor_id,
            access_type: accessType,
            granted_at: new Date().toISOString(),
            expires_at: updateData.expires_at,
            status: 'active'
          });

        if (accessError) {
          console.error('Error creating patient access record:', accessError);
          // Don't throw here, just log the error and continue
        } else {
          console.log(`Created patient access record for ${accessType}`);
        }
      }
    }

    const doctorName = await getDoctorName(data.doctor_id);

    // Get patient and doctor user_ids for notifications
    const { data: patientUser, error: patientUserError } = await supabase
      .from('profiles')
      .select('user_id, full_name')
      .eq('id', data.patient_id)
      .single();

    const { data: doctorUser, error: doctorUserError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', data.doctor_id)
      .single();

    // Create notifications based on response
    if (response.status === 'approved') {
      // Notify doctor about approval
      if (doctorUser && !doctorUserError) {
        await createConsentApprovedNotification(
          doctorUser.user_id,
          data.doctor_id,
          patientUser?.full_name || 'Patient'
        );
        
        await createRecordAccessNotification(
          doctorUser.user_id,
          data.doctor_id,
          patientUser?.full_name || 'Patient',
          'granted'
        );
      }
    } else if (response.status === 'denied') {
      // Notify doctor about denial
      if (doctorUser && !doctorUserError) {
        await createConsentDeniedNotification(
          doctorUser.user_id,
          data.doctor_id,
          patientUser?.full_name || 'Patient'
        );
      }
    }

    return {
      id: data.id,
      patientId: data.patient_id,
      requesterId: data.doctor_id,
      requesterName: doctorName,
      purpose: data.purpose,
      requestedDataTypes: data.requested_data_types as RecordType[],
      duration: data.duration_days,
      status: data.status as ConsentStatus,
      requestedAt: new Date(data.requested_at),
      respondedAt: data.responded_at ? new Date(data.responded_at) : undefined,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      message: data.message
    };
  } catch (error) {
    console.error('Error responding to consent request:', error);
    throw error;
  }
};

// Revoke a consent request
export const revokeConsentRequest = async (requestId: string): Promise<ConsentRequest> => {
  try {
    console.log('🔄 Starting to revoke consent request:', requestId);
    
    // First, try to get the request from consent_requests table
    let originalRequest: any = null;
    let isFromHealthRecords = false;
    
    const { data: consentRequest, error: fetchError } = await supabase
      .from('consent_requests')
      .select('*')
      .eq('id', requestId)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('❌ Error fetching consent request:', fetchError);
      throw new Error(`Failed to fetch consent request: ${fetchError.message}`);
    }

    if (consentRequest) {
      originalRequest = consentRequest;
      isFromHealthRecords = false;
      console.log('✅ Found consent request in consent_requests table:', originalRequest);
    } else {
      // Not found in consent_requests, check if it's a consent form from health_records
      console.log('⚠️ Not found in consent_requests, checking health_records...');
      const { data: healthRecord, error: healthRecordError } = await supabase
        .from('health_records')
        .select('*')
        .eq('id', requestId)
        .contains('tags', ['consent_form'])
        .maybeSingle();

      if (healthRecordError && healthRecordError.code !== 'PGRST116') {
        console.error('❌ Error fetching health record:', healthRecordError);
        throw new Error(`Failed to fetch consent form: ${healthRecordError.message}`);
      }

      if (healthRecord) {
        // Parse metadata to get consent request info
        let metadata: any = {};
        try {
          const description = healthRecord.description || '';
          const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
          if (metadataMatch) {
            metadata = JSON.parse(metadataMatch[1]);
          }
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }

        // Convert health record to consent request format
        originalRequest = {
          id: healthRecord.id,
          patient_id: metadata.patient_id || healthRecord.user_id,
          doctor_id: metadata.doctor_id || '',
          purpose: healthRecord.title,
          requested_data_types: ['health_records'],
          duration_days: metadata.duration_days || 30,
          status: metadata.status || 'approved',
          requested_at: healthRecord.created_at,
          responded_at: metadata.responded_at,
          expires_at: metadata.expires_at,
          message: undefined
        };
        isFromHealthRecords = true;
        console.log('✅ Found consent form in health_records:', originalRequest);
      } else {
        throw new Error('Consent request not found in consent_requests or health_records');
      }
    }

    let updatedRequest: any = null;

    if (isFromHealthRecords) {
      // Update health record consent form
      console.log('🔄 Updating consent form in health_records...');
      
      // Get the full health record to access description
      const { data: healthRecord, error: healthRecordFetchError } = await supabase
        .from('health_records')
        .select('description')
        .eq('id', requestId)
        .single();

      if (healthRecordFetchError || !healthRecord) {
        throw new Error('Failed to fetch health record for update');
      }

      // Parse existing metadata
      let metadata: any = {};
      try {
        const description = healthRecord.description || '';
        const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
        if (metadataMatch) {
          metadata = JSON.parse(metadataMatch[1]);
        }
      } catch (e) {
        console.error('Error parsing metadata:', e);
      }

      // Update metadata status
      metadata.status = 'revoked';
      metadata.revoked_at = new Date().toISOString();

      // Reconstruct description with updated metadata
      let descriptionWithoutMetadata = healthRecord.description || '';
      const metadataIndex = descriptionWithoutMetadata.indexOf('[METADATA]');
      if (metadataIndex !== -1) {
        descriptionWithoutMetadata = descriptionWithoutMetadata.substring(0, metadataIndex).trim();
      }

      const updatedDescription = `${descriptionWithoutMetadata}\n\n---\n[METADATA]\n${JSON.stringify(metadata, null, 2)}`;

      const { data: updatedHealthRecord, error: updateError } = await supabase
        .from('health_records')
        .update({
          tags: ['consent_form', 'revoked', ...(metadata.de_identified ? ['de-identified'] : ['identified'])],
          description: updatedDescription
        })
        .eq('id', requestId)
        .select('*')
        .maybeSingle();

      if (updateError) {
        console.error('❌ Error updating health record:', updateError);
        throw new Error(`Failed to update consent form: ${updateError.message}`);
      }

      if (!updatedHealthRecord) {
        throw new Error('Failed to verify consent form update');
      }

      updatedRequest = {
        ...originalRequest,
        status: 'revoked'
      };
      console.log('✅ Successfully updated consent form in health_records');
    } else {
      // Update consent request in consent_requests table
      console.log('🔄 Updating consent request in consent_requests table...');
      
      const updateData: any = {
        status: 'revoked'
      };

      // Try the update without updated_at first
      let { data: updated, error: updateError } = await supabase
        .from('consent_requests')
        .update(updateData)
        .eq('id', requestId)
        .select('*')
        .maybeSingle();

      // If that fails, try with updated_at
      if (updateError || !updated) {
        console.log('⚠️ First update attempt failed, trying with updated_at...');
        updateData.updated_at = new Date().toISOString();
        const retryResult = await supabase
          .from('consent_requests')
          .update(updateData)
          .eq('id', requestId)
          .select('*')
          .maybeSingle();
        
        updated = retryResult.data;
        updateError = retryResult.error;
      }

      if (updateError) {
        console.error('❌ Error updating consent request:', updateError);
        throw new Error(`Failed to update consent request: ${updateError.message}`);
      }

      if (!updated) {
        // If no data returned, fetch it again to get the updated record
        const { data: refetched, error: refetchError } = await supabase
          .from('consent_requests')
          .select('*')
          .eq('id', requestId)
          .maybeSingle();
        
        if (refetchError || !refetched) {
          throw new Error('Failed to verify consent request update');
        }
        updated = refetched;
      }

      updatedRequest = updated;
      console.log('✅ Successfully updated consent request:', updatedRequest);
    }

    // Revoke corresponding patient_access records
    console.log('🔄 Revoking patient access records for revoked consent:', {
      patientId: originalRequest.patient_id,
      doctorId: originalRequest.doctor_id
    });

    const accessUpdateData: any = {
      status: 'revoked'
    };

    // Try without updated_at first
    let { error: revokeError } = await supabase
      .from('patient_access')
      .update(accessUpdateData)
      .eq('patient_id', originalRequest.patient_id)
      .eq('doctor_id', originalRequest.doctor_id)
      .eq('status', 'active');

    // If that fails, try with updated_at
    if (revokeError) {
      console.log('⚠️ First patient_access update failed, trying with updated_at...');
      accessUpdateData.updated_at = new Date().toISOString();
      const retryResult = await supabase
        .from('patient_access')
        .update(accessUpdateData)
        .eq('patient_id', originalRequest.patient_id)
        .eq('doctor_id', originalRequest.doctor_id)
        .eq('status', 'active');
      
      revokeError = retryResult.error;
    }

    if (revokeError) {
      console.error('⚠️ Error revoking patient access records (non-fatal):', revokeError);
      // Don't throw here, just log the error - the consent request was revoked successfully
    } else {
      console.log('✅ Successfully revoked patient access records');
    }

    const doctorName = await getDoctorName(updatedRequest.doctor_id);

    return {
      id: updatedRequest.id,
      patientId: updatedRequest.patient_id,
      requesterId: updatedRequest.doctor_id,
      requesterName: doctorName,
      purpose: updatedRequest.purpose,
      requestedDataTypes: updatedRequest.requested_data_types as RecordType[],
      duration: updatedRequest.duration_days,
      status: updatedRequest.status as ConsentStatus,
      requestedAt: new Date(updatedRequest.requested_at),
      respondedAt: updatedRequest.responded_at ? new Date(updatedRequest.responded_at) : undefined,
      expiresAt: updatedRequest.expires_at ? new Date(updatedRequest.expires_at) : undefined,
      message: updatedRequest.message
    };
  } catch (error: any) {
    console.error('❌ Error revoking consent request:', error);
    // Provide a more user-friendly error message
    const errorMessage = error?.message || error?.toString() || 'Unknown error occurred';
    throw new Error(`Failed to revoke consent: ${errorMessage}`);
  }
};

// Extend consent request expiration
export const extendConsentRequest = async (requestId: string, additionalDays: number = 30): Promise<ConsentRequest> => {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from('consent_requests')
      .select('expires_at')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;

    const currentExpiry = currentData.expires_at ? new Date(currentData.expires_at) : new Date();
    const newExpiry = new Date(currentExpiry.getTime() + additionalDays * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('consent_requests')
      .update({
        expires_at: newExpiry.toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select('*')
      .single();

    if (error) throw error;

    const doctorName = await getDoctorName(data.doctor_id);

    return {
      id: data.id,
      patientId: data.patient_id,
      requesterId: data.doctor_id,
      requesterName: doctorName,
      purpose: data.purpose,
      requestedDataTypes: data.requested_data_types as RecordType[],
      duration: data.duration_days,
      status: data.status as ConsentStatus,
      requestedAt: new Date(data.requested_at),
      respondedAt: data.responded_at ? new Date(data.responded_at) : undefined,
      expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
      message: data.message
    };
  } catch (error) {
    console.error('Error extending consent request:', error);
    throw error;
  }
};

// Get patients for a doctor (for creating consent requests)
export const getPatientsForDoctor = async (doctorId: string) => {
  try {
    console.log('Getting patients for doctor profile ID:', doctorId);
    
    // First, let's check what profiles exist
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .order('role, full_name');
    
    console.log('All profiles in database:', allProfiles);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, role')
      .eq('role', 'patient')
      .not('id', 'is', null)
      .not('full_name', 'is', null)
      .order('full_name');

    if (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }

    console.log('Found patients:', data);

    if (!data || data.length === 0) {
      console.warn('No patients found in database');
      return [];
    }

    const patients = data.map(patient => ({
      id: patient.id,
      name: patient.full_name || 'Unknown Patient',
      email: patient.email || 'No email'
    }));

    console.log('Processed patients:', patients);
    return patients;
  } catch (error) {
    console.error('Error fetching patients for doctor:', error);
    throw error;
  }
};

// Fix existing approved consent requests by creating missing patient_access records
export const fixExistingConsentAccess = async (): Promise<void> => {
  try {
    console.log('Fixing existing approved consent requests...');
    
    // Get all approved consent requests that don't have corresponding patient_access records
    const { data: approvedConsents, error: consentError } = await supabase
      .from('consent_requests')
      .select('*')
      .eq('status', 'approved');

    if (consentError) throw consentError;

    if (!approvedConsents || approvedConsents.length === 0) {
      console.log('No approved consent requests found.');
      return;
    }

    console.log(`Found ${approvedConsents.length} approved consent requests`);

    for (const consent of approvedConsents) {
      // Check if patient_access records already exist for this consent
      const { data: existingAccess, error: accessCheckError } = await supabase
        .from('patient_access')
        .select('id')
        .eq('patient_id', consent.patient_id)
        .eq('doctor_id', consent.doctor_id)
        .eq('status', 'active');

      if (accessCheckError) {
        console.error('Error checking existing access:', accessCheckError);
        continue;
      }

      if (existingAccess && existingAccess.length > 0) {
        console.log(`Access records already exist for consent ${consent.id}`);
        continue;
      }

      // Create patient_access records for this consent
      console.log(`Creating access records for consent ${consent.id}`);
      
      // Map data types to access types
      const accessTypeMap: Record<string, string> = {
        'health_records': 'view_records',
        'prescriptions': 'view_prescriptions', 
        'consultation_notes': 'view_consultation_notes',
        'all': 'all'
      };

      // Create access records for each requested data type
      for (const dataType of consent.requested_data_types || []) {
        const accessType = accessTypeMap[dataType] || 'view_records';
        
        const { error: accessError } = await supabase
          .from('patient_access')
          .insert({
            patient_id: consent.patient_id,
            doctor_id: consent.doctor_id,
            access_type: accessType,
            granted_at: consent.responded_at || consent.requested_at,
            expires_at: consent.expires_at,
            status: 'active'
          });

        if (accessError) {
          console.error(`Error creating patient access record for ${accessType}:`, accessError);
        } else {
          console.log(`Created patient access record for ${accessType}`);
        }
      }
    }

    console.log('Finished fixing existing consent requests.');
  } catch (error) {
    console.error('Error fixing existing consent access:', error);
    throw error;
  }
};
