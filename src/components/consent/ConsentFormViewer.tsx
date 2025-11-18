import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConsentRequest } from '@/types';
import { format } from 'date-fns';
import { Shield, Calendar, User, FileText, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ConsentFormViewerProps {
  isOpen: boolean;
  onClose: () => void;
  consentRequest: ConsentRequest | null;
}

const ConsentFormViewer: React.FC<ConsentFormViewerProps> = ({ isOpen, onClose, consentRequest }) => {
  const { user } = useAuth();
  const [consentFormData, setConsentFormData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [currentUserProfileId, setCurrentUserProfileId] = useState<string | null>(null);
  const isPatient = user?.role === 'patient';
  const isDoctor = user?.role === 'doctor';

  // Get current user's profile ID
  useEffect(() => {
    const getCurrentUserProfile = async () => {
      if (!user?.id) return;
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('user_id', user.id)
          .single();
        if (profile) {
          setCurrentUserProfileId(profile.id);
        }
      } catch (e) {
        console.error('Error fetching current user profile:', e);
      }
    };
    getCurrentUserProfile();
  }, [user?.id]);

  useEffect(() => {
    if (isOpen && consentRequest && (currentUserProfileId !== null || !isDoctor)) {
      loadConsentFormData();
    }
  }, [isOpen, consentRequest, currentUserProfileId]);

  const loadConsentFormData = async () => {
    if (!consentRequest) return;

    setLoading(true);
    try {
      // Try multiple ways to find the consent form in health_records
      // 1. Try by ID directly
      let healthRecord: any = null;

      const { data: recordById, error: errorById } = await supabase
        .from('health_records')
        .select('*')
        .eq('id', consentRequest.id)
        .contains('tags', ['consent_form'])
        .maybeSingle();

      if (recordById && !errorById) {
        healthRecord = recordById;
      } else {
        // 2. Try by record_type = 'consent' and matching title/purpose
        const { data: recordByType, error: errorByType } = await supabase
          .from('health_records')
          .select('*')
          .eq('record_type', 'consent')
          .ilike('title', `%${consentRequest.purpose}%`)
          .contains('tags', ['consent_form'])
          .maybeSingle();

        if (recordByType && !errorByType) {
          healthRecord = recordByType;
        } else {
          // 3. Try searching all health_records with consent_form tag and check metadata
          const { data: allConsentForms, error: errorAll } = await supabase
            .from('health_records')
            .select('*')
            .contains('tags', ['consent_form'])
            .limit(100);

          if (allConsentForms && !errorAll) {
            // Search through metadata for matching consent_request_id
            for (const record of allConsentForms) {
              try {
                const description = record.description || '';
                const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
                if (metadataMatch) {
                  const metadata = JSON.parse(metadataMatch[1]);
                  if (metadata.consent_request_id === consentRequest.id) {
                    healthRecord = record;
                    break;
                  }
                }
              } catch (e) {
                // Continue searching
              }
            }
          }
        }
      }

      if (healthRecord) {
        // Parse the consent form from description
        const description = healthRecord.description || '';
        
        // Extract metadata
        let metadata: any = {};
        try {
          const metadataMatch = description.match(/\[METADATA\]\s*(\{[\s\S]*\})/);
          if (metadataMatch) {
            metadata = JSON.parse(metadataMatch[1]);
          }
        } catch (e) {
          console.error('Error parsing metadata:', e);
        }

        // Extract consent form content (everything before [METADATA])
        const metadataIndex = description.indexOf('[METADATA]');
        let consentFormContent = metadataIndex !== -1 
          ? description.substring(0, metadataIndex).trim()
          : description;
        
        // Ensure patient ID is included in the form content if it's missing
        // Check if the form content has a Patient ID line
        if (!consentFormContent.includes('Patient ID:') && metadata.patient_id) {
          // Try to insert Patient ID after Patient line
          const patientLineMatch = consentFormContent.match(/Patient:\s*.*/i);
          if (patientLineMatch) {
            const insertIndex = patientLineMatch.index! + patientLineMatch[0].length;
            consentFormContent = consentFormContent.slice(0, insertIndex) + 
              `\nPatient ID: ${metadata.patient_id}` + 
              consentFormContent.slice(insertIndex);
          }
        }

        // Get patient data - behavior depends on user role
        let patientFullName = 'Unknown Patient';
        let patientMRN = null;
        let shouldShowSanitized = false;
        let doctorFullName = 'Unknown Doctor';
        
        // Get doctor's name - prioritize multiple sources
        // 1. If current user is doctor and this is their consent, use their profile or auth context
        if (isDoctor && currentUserProfileId && (metadata.doctor_id === currentUserProfileId || consentRequest.requesterId === currentUserProfileId)) {
          try {
            const { data: currentDoctorProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', currentUserProfileId)
              .single();
            if (currentDoctorProfile?.full_name) {
              doctorFullName = currentDoctorProfile.full_name;
            } else if (user?.name) {
              // Fallback to user name from auth context
              doctorFullName = user.name;
            }
          } catch (e) {
            console.error('Error fetching current doctor profile:', e);
            // Fallback to user name from auth context
            if (user?.name) {
              doctorFullName = user.name;
            }
          }
        }
        
        // 2. Try provider_name from health record
        if ((!doctorFullName || doctorFullName === 'Unknown Doctor') && healthRecord.provider_name) {
          doctorFullName = healthRecord.provider_name;
        }
        
        // 3. Try metadata provider
        if ((!doctorFullName || doctorFullName === 'Unknown Doctor') && metadata.provider) {
          doctorFullName = metadata.provider;
        }
        
        // 4. Try requesterName from consent request
        if ((!doctorFullName || doctorFullName === 'Unknown Doctor') && consentRequest.requesterName) {
          doctorFullName = consentRequest.requesterName;
        }
        
        // 5. Try fetching from doctor_id in metadata or requesterId
        if ((!doctorFullName || doctorFullName === 'Unknown Doctor') && (metadata.doctor_id || consentRequest.requesterId)) {
          try {
            const doctorId = metadata.doctor_id || consentRequest.requesterId;
            const { data: doctorProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', doctorId)
              .single();
            if (doctorProfile?.full_name) {
              doctorFullName = doctorProfile.full_name;
            }
          } catch (e) {
            console.error('Error fetching doctor profile:', e);
          }
        }
        
        // 6. Final fallback - if doctor is viewing and still unknown, use their auth context name
        if ((!doctorFullName || doctorFullName === 'Unknown Doctor') && isDoctor && user?.name) {
          doctorFullName = user.name;
        }
        
        // Get actual patient data for sanitization purposes
        let actualPatientFullName = '';
        let actualPatientMRN = '';
        if (metadata.patient_id) {
          try {
            const { data: patientProfile } = await supabase
              .from('profiles')
              .select('full_name, mrn')
              .eq('id', metadata.patient_id)
              .single();
            if (patientProfile?.full_name) {
              actualPatientFullName = patientProfile.full_name;
            }
            if (patientProfile?.mrn) {
              actualPatientMRN = patientProfile.mrn;
            }
          } catch (e) {
            console.error('Error fetching patient profile for sanitization:', e);
          }
        }

        // Doctors ALWAYS see sanitized version (with [REDACTED] for patient info)
        // Patients ALWAYS see full details
        if (isDoctor) {
          // Doctor viewing - always show sanitized version
          shouldShowSanitized = true;
          patientFullName = '[REDACTED]';
          patientMRN = '[REDACTED]';
          
          // Ensure form content is sanitized for doctors
          // Always sanitize for doctors, even if already partially sanitized
          if (actualPatientFullName) {
            consentFormContent = consentFormContent
              .replace(new RegExp(actualPatientFullName, 'gi'), '[REDACTED]');
          }
          if (actualPatientMRN) {
            consentFormContent = consentFormContent
              .replace(new RegExp(actualPatientMRN, 'gi'), '[REDACTED]');
          }
          if (metadata.patient_id) {
            consentFormContent = consentFormContent
              .replace(new RegExp(metadata.patient_id, 'gi'), '[REDACTED]');
          }
          // Replace any [Patient ID] placeholders with [REDACTED]
          consentFormContent = consentFormContent
            .replace(/\[Patient ID\]/g, '[REDACTED]')
            .replace(/Patient ID: \[Patient ID\]/g, 'Patient ID: [REDACTED]');
        } else {
          // Patient viewing - always show full details
          shouldShowSanitized = false;
          
          // Get real patient data
          if (metadata.patient_id) {
            try {
              const { data: patientProfile } = await supabase
                .from('profiles')
                .select('full_name, mrn')
                .eq('id', metadata.patient_id)
                .single();
              if (patientProfile?.full_name) {
                patientFullName = patientProfile.full_name;
              }
              if (patientProfile?.mrn) {
                patientMRN = patientProfile.mrn;
              }
            } catch (e) {
              console.error('Error fetching patient profile:', e);
              // Fallback to metadata if available
              if (metadata.patient_name && metadata.patient_name !== '[REDACTED]') {
                patientFullName = metadata.patient_name;
              }
            }
          }

          // Replace redacted values in the content with actual data for patients
          consentFormContent = consentFormContent
            .replace(/Patient: \[REDACTED\]/g, `Patient: ${patientFullName}`)
            .replace(/Patient ID: \[REDACTED\]/g, `Patient ID: ${metadata.patient_id || 'N/A'}`)
            .replace(/Patient ID: \[Patient ID\]/g, `Patient ID: ${metadata.patient_id || 'N/A'}`)
            .replace(/\[Patient ID\]/g, metadata.patient_id || 'N/A') // Replace any standalone [Patient ID] placeholders
            .replace(/MRN: \[REDACTED\]/g, `MRN: ${patientMRN || metadata.mrn || 'N/A'}`)
            .replace(/\(SANITIZED VERSION\)/g, '')
            .replace(/De-identified for educational purposes\./g, '')
            .replace(/NOTE: This document has been de-identified for privacy protection\. All personal identifiers have been removed\./g, '');
        }

        setConsentFormData({
          type: 'form',
          content: consentFormContent || '', // Ensure content is always set
          metadata: {
            ...metadata,
            patient_name: shouldShowSanitized ? metadata.patient_name : patientFullName,
            mrn: shouldShowSanitized ? metadata.mrn : (patientMRN || metadata.mrn),
            shouldShowSanitized: shouldShowSanitized,
            doctor_name: doctorFullName,
            actual_patient_name: actualPatientFullName, // Store actual name for sanitization
            actual_patient_mrn: actualPatientMRN
          },
          healthRecord: healthRecord,
          patientFullName: shouldShowSanitized ? '[REDACTED]' : patientFullName,
          doctorFullName: doctorFullName,
          actualPatientFullName: actualPatientFullName // Store for sanitization
        });
      } else {
        // No health record found - try to create a form view from the consent request
        // This ensures doctors can still see the form structure
        let formContent = '';
        if (consentRequest.message) {
          formContent = consentRequest.message;
        } else {
          // Create a basic form structure from the request
          // Get patient name first for proper display
          let displayPatientName = (consentRequest as any).patientName || 'Unknown Patient';
          let displayPatientId = consentRequest.patientId || 'N/A';
          
          formContent = `CONSENT FOR PROCEDURE 

Title: Consent for ${consentRequest.purpose || 'Procedure'}

Date: ${format(consentRequest.requestedAt, 'MMMM dd, yyyy')}

Patient: ${isDoctor ? '[REDACTED]' : displayPatientName}
Patient ID: ${isDoctor ? '[REDACTED]' : displayPatientId}

SUMMARY:

${consentRequest.message || '.'}

CONSENT:

The patient has been informed of the procedure, its benefits, risks, and alternatives. The patient voluntarily agrees to the procedure, and consent was obtained as per institutional policy.

PROVIDER: ${consentRequest.requesterName || 'Unknown Doctor'}

---

This consent form has been completed in accordance with institutional policies and procedures.`;
        }

        // Sanitize for doctors - replace any patient identifiers that might be in the message
        if (isDoctor) {
          if ((consentRequest as any).patientName) {
            formContent = formContent.replace(new RegExp((consentRequest as any).patientName, 'gi'), '[REDACTED]');
          }
          if (consentRequest.patientId) {
            formContent = formContent.replace(new RegExp(consentRequest.patientId, 'gi'), '[REDACTED]');
          }
        }

        // Get patient and doctor details for the form
        let patientFullNameForForm = (consentRequest as any).patientName || 'Unknown Patient';
        let doctorFullNameForForm = consentRequest.requesterName || 'Unknown Doctor';
        
        if (consentRequest.patientId && !isDoctor) {
          try {
            const { data: patientProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', consentRequest.patientId)
              .single();
            if (patientProfile?.full_name) {
              patientFullNameForForm = patientProfile.full_name;
            }
          } catch (e) {
            // Use existing name if profile fetch fails
          }
        }

        // Get doctor's name from profile if available
        if (consentRequest.requesterId) {
          try {
            const { data: doctorProfile } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', consentRequest.requesterId)
              .single();
            if (doctorProfile?.full_name) {
              doctorFullNameForForm = doctorProfile.full_name;
            }
          } catch (e) {
            console.error('Error fetching doctor profile:', e);
          }
        }

        setConsentFormData({
          type: 'form',
          content: formContent,
          metadata: {
            status: consentRequest.status,
            procedure: consentRequest.purpose,
            patient_id: isDoctor ? '[REDACTED]' : consentRequest.patientId,
            patient_name: isDoctor ? '[REDACTED]' : patientFullNameForForm,
            shouldShowSanitized: isDoctor,
            provider: doctorFullNameForForm,
            actual_patient_name: patientFullNameForForm
          },
          healthRecord: null,
          patientFullName: isDoctor ? '[REDACTED]' : patientFullNameForForm,
          doctorFullName: doctorFullNameForForm,
          actualPatientFullName: patientFullNameForForm
        });
      }
    } catch (error) {
      console.error('Error loading consent form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="h-4 w-4" />,
      approved: <CheckCircle className="h-4 w-4" />,
      denied: <XCircle className="h-4 w-4" />,
      revoked: <XCircle className="h-4 w-4" />,
      expired: <AlertCircle className="h-4 w-4" />
    };
    return icons[status as keyof typeof icons] || <Clock className="h-4 w-4" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-warning',
      approved: 'bg-accent',
      denied: 'bg-destructive',
      revoked: 'bg-muted',
      expired: 'bg-muted'
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  if (!consentRequest) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-accent" />
            Consent Form Details
          </DialogTitle>
          <DialogDescription>
            Full details of the consent request
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : consentFormData?.type === 'form' ? (
          // Display full consent form with all details
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(consentFormData.metadata?.status || consentRequest.status)} text-white`}>
                {getStatusIcon(consentFormData.metadata?.status || consentRequest.status)}
                <span className="ml-1 capitalize">{consentFormData.metadata?.status || consentRequest.status}</span>
              </Badge>
            </div>

            {/* Consent Information Summary */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Consent Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Patient</p>
                    <p className="text-base font-medium">
                      {isDoctor ? '[REDACTED]' : (consentFormData.patientFullName || consentFormData.metadata?.patient_name || 'Unknown Patient')}
                    </p>
                    {(consentFormData.metadata?.patient_id || consentRequest.patientId) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {isDoctor ? '[REDACTED]' : (consentFormData.metadata?.patient_id || consentRequest.patientId)}
                      </p>
                    )}
                    {consentFormData.metadata?.mrn && consentFormData.metadata.mrn !== '[REDACTED]' && !isDoctor && (
                      <p className="text-xs text-muted-foreground">MRN: {consentFormData.metadata.mrn}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{isDoctor ? 'You (Provider)' : 'Provider'}</p>
                    <p className="text-base font-medium">{consentFormData.doctorFullName || consentFormData.metadata?.provider || consentRequest.requesterName || 'Unknown Doctor'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Procedure</p>
                    <p className="text-base">{consentFormData.metadata?.procedure || consentRequest.purpose || '.'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                    <p className="text-base flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {consentFormData.healthRecord?.service_date 
                        ? format(new Date(consentFormData.healthRecord.service_date), 'PPP')
                        : format(consentRequest.requestedAt, 'PPP')
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                    <p className="text-base">{consentRequest.duration} days</p>
                    {consentRequest.expiresAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {format(consentRequest.expiresAt, 'PPP')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Always show Summary section */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Summary</p>
                  <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                    {consentFormData.metadata?.summary ? (
                      isDoctor ? (() => {
                        let sanitized = consentFormData.metadata.summary || '';
                        if (consentFormData.metadata.patient_id && consentFormData.metadata.patient_id !== '[REDACTED]') {
                          sanitized = sanitized.replace(new RegExp(consentFormData.metadata.patient_id, 'gi'), '[REDACTED]');
                        }
                        // Use actual patient name stored in metadata for sanitization
                        const actualName = consentFormData.metadata?.actual_patient_name || consentFormData.actualPatientFullName;
                        if (actualName && actualName !== '[REDACTED]') {
                          sanitized = sanitized.replace(new RegExp(actualName, 'gi'), '[REDACTED]');
                        }
                        return sanitized;
                      })() : consentFormData.metadata.summary
                    ) : '.'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Full Consent Form Document */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Full Consent Form Document
                </h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-muted p-6 rounded-lg border">
                    {consentFormData.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Timeline - Always show at bottom */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Requested:</span>
                    <span>{format(consentRequest.requestedAt, 'PPP p')}</span>
                  </div>
                  
                  {consentRequest.respondedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Responded:</span>
                      <span>{format(consentRequest.respondedAt, 'PPP p')}</span>
                    </div>
                  )}
                  
                  {consentRequest.expiresAt && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Expires:</span>
                      <span>{format(consentRequest.expiresAt, 'PPP p')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Display consent request details - same structure for both, but sanitized for doctors
          <div className="space-y-4">
            {/* Status Badge */}
            <div className="flex items-center justify-between">
              <Badge className={`${getStatusColor(consentRequest.status)} text-white`}>
                {getStatusIcon(consentRequest.status)}
                <span className="ml-1 capitalize">{consentRequest.status}</span>
              </Badge>
            </div>

            {/* Consent Information */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Consent Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Patient</p>
                    <p className="text-base font-medium">
                      {isDoctor ? '[REDACTED]' : (consentFormData?.patientFullName || (consentRequest as any).patientName || 'Unknown Patient')}
                    </p>
                    {consentRequest.patientId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        ID: {isDoctor ? '[REDACTED]' : consentRequest.patientId}
                      </p>
                    )}
                    {isDoctor && (
                      <p className="text-xs text-warning mt-1">⚠️ De-identified for privacy</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">{isDoctor ? 'You (Requester/Provider)' : 'Requester/Provider'}</p>
                    <p className="text-base font-medium">{consentFormData?.doctorFullName || consentRequest.requesterName || 'Unknown Doctor'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Purpose/Procedure</p>
                    <p className="text-base">{consentRequest.purpose || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Date</p>
                    <p className="text-base flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {format(consentRequest.requestedAt, 'PPP')}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">Duration</p>
                    <p className="text-base">{consentRequest.duration} days</p>
                    {consentRequest.expiresAt && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Expires: {format(consentRequest.expiresAt, 'PPP')}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Requested Data Types</p>
                    <div className="flex flex-wrap gap-2">
                      {consentRequest.requestedDataTypes.map((type) => (
                        <Badge key={type} variant="outline">
                          {type.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {consentRequest.message && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Message/Details</p>
                    <p className="text-sm bg-muted p-3 rounded-lg whitespace-pre-wrap">
                      {isDoctor ? (() => {
                        // Sanitize message for doctors - replace patient identifiers
                        let sanitizedMessage = consentRequest.message || '';
                        if (consentRequest.patientId) {
                          sanitizedMessage = sanitizedMessage.replace(new RegExp(consentRequest.patientId, 'gi'), '[REDACTED]');
                        }
                        // Get actual patient name for sanitization
                        const patientName = (consentRequest as any).patientName;
                        if (patientName && patientName !== '[REDACTED]' && patientName !== 'Unknown Patient') {
                          sanitizedMessage = sanitizedMessage.replace(new RegExp(patientName, 'gi'), '[REDACTED]');
                        }
                        return sanitizedMessage;
                      })() : consentRequest.message}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Timeline
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-medium">Requested:</span>
                    <span>{format(consentRequest.requestedAt, 'PPP p')}</span>
                  </div>
                  
                  {consentRequest.respondedAt && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Responded:</span>
                      <span>{format(consentRequest.respondedAt, 'PPP p')}</span>
                    </div>
                  )}
                  
                  {consentRequest.expiresAt && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground font-medium">Expires:</span>
                      <span>{format(consentRequest.expiresAt, 'PPP p')}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConsentFormViewer;

