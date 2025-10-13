export interface Notification {
  id: string;
  userId: string;
  type: 'consent_request' | 'consent_approved' | 'consent_denied' | 
        'prescription_created' | 'prescription_updated' |
        'consultation_note_created' | 'consultation_note_updated' |
        'record_access_granted' | 'record_access_denied' |
        'consultation_booked' | 'consultation_updated' |
        'ai_analysis_complete' | 'health_alert' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export interface CreateNotificationData {
  userId: string;
  profileId?: string; // Make this optional
  type: 'consent_request' | 'consent_approved' | 'consent_denied' | 
        'prescription_created' | 'prescription_updated' |
        'consultation_note_created' | 'consultation_note_updated' |
        'record_access_granted' | 'record_access_denied' |
        'consultation_booked' | 'consultation_updated' |
        'ai_analysis_complete' | 'health_alert' | 'system';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}
