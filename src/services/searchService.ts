import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  id: string;
  type: 'prescription' | 'health_record' | 'consultation' | 'consultation_note' | 'patient' | 'consent';
  title: string;
  description?: string;
  subtitle?: string;
  date?: string;
  metadata?: Record<string, any>;
  url?: string;
}

export interface SearchResults {
  prescriptions: SearchResult[];
  healthRecords: SearchResult[];
  consultations: SearchResult[];
  consultationNotes: SearchResult[];
  patients: SearchResult[];
  consents: SearchResult[];
  pages: SearchResult[];
  total: number;
}

/**
 * Comprehensive search across all entities in the application
 */
export const searchAll = async (query: string, userId: string, userRole: string): Promise<SearchResults> => {
  if (!query || query.trim().length < 2) {
    return {
      prescriptions: [],
      healthRecords: [],
      consultations: [],
      consultationNotes: [],
      patients: [],
      consents: [],
      pages: [],
      total: 0,
    };
  }

  const searchTerm = query.trim();
  const searchPattern = `%${searchTerm}%`;
  const results: SearchResults = {
    prescriptions: [],
    healthRecords: [],
    consultations: [],
    consultationNotes: [],
    patients: [],
    consents: [],
    pages: [],
    total: 0,
  };

  try {
    // Get user's profile ID
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      console.error('❌ Error fetching profile:', profileError);
      return results;
    }

    const profileId = (profile as { id: string }).id;
    console.log('🔍 Search started:', { profileId, role: userRole, query: searchTerm });

    // First, test if we can query at all
    const { data: testData, error: testError } = await supabase
      .from('prescriptions')
      .select('id')
      .limit(1);
    console.log('🧪 Connection test:', { hasData: !!testData, error: testError, count: testData?.length || 0 });

    // Search for pages/navigation items
    const pageSearchTerm = searchTerm.toLowerCase();
    const pages: SearchResult[] = [];
    
    const pageItems = [
      // Main pages
      { name: 'My Patients', url: '/doctor/patients', role: 'doctor' },
      { name: 'Prescriptions', url: userRole === 'doctor' ? '/doctor/prescriptions' : '/prescriptions', role: 'both' },
      { name: 'Consultations', url: userRole === 'doctor' ? '/doctor/consultations' : '/consultations', role: 'both' },
      { name: 'Consultation Notes', url: userRole === 'doctor' ? '/doctor/consultation-notes' : '/consultation-notes', role: 'both' },
      { name: 'Health Records', url: '/health-records', role: 'patient' },
      { name: 'Consents', url: userRole === 'doctor' ? '/doctor/consents' : '/consent-management', role: 'both' },
      { name: 'Dashboard', url: userRole === 'doctor' ? '/doctor/dashboard' : '/dashboard', role: 'both' },
      { name: 'Profile', url: userRole === 'doctor' ? '/doctor/profile' : '/profile', role: 'both' },
      { name: 'Settings', url: userRole === 'doctor' ? '/doctor/settings' : '/settings', role: 'both' },
      { name: 'Share Data', url: '/share-data', role: 'patient' },
      { name: 'Patient Access', url: '/patient-access', role: 'patient' },
      // Coming soon pages - Patient
      { name: 'Vendors', url: '/vendors', role: 'patient' },
      { name: 'Medical Device Companies', url: '/medical-device-companies', role: 'patient' },
      { name: 'Insurance Partners', url: '/insurance-partners', role: 'patient' },
      { name: 'Pharmacies', url: '/pharmacies', role: 'patient' },
      { name: 'Loans', url: '/loans', role: 'patient' },
      { name: 'Coupons Schemes', url: '/coupons-schemes', role: 'patient' },
      { name: 'Medical Tourism', url: '/medical-tourism', role: 'patient' },
      { name: 'Clinical Research', url: '/clinical-research', role: 'patient' },
      { name: 'Finance Partners', url: '/finance-partners', role: 'patient' },
      { name: 'Tele Health', url: '/coming-soon/tele-health', role: 'patient' },
      { name: 'Remote Monitoring', url: '/coming-soon/remote-monitoring', role: 'patient' },
      // Coming soon pages - Doctor
      { name: 'Vendors', url: '/doctor/vendors', role: 'doctor' },
      { name: 'Medical Device Companies', url: '/doctor/medical-device-companies', role: 'doctor' },
      { name: 'Insurance Partners', url: '/doctor/insurance-partners', role: 'doctor' },
      { name: 'Pharmacies', url: '/doctor/pharmacies', role: 'doctor' },
      { name: 'Loans', url: '/doctor/loans', role: 'doctor' },
      { name: 'Coupons Schemes', url: '/doctor/coupons-schemes', role: 'doctor' },
      { name: 'Medical Tourism', url: '/doctor/medical-tourism', role: 'doctor' },
      { name: 'Clinical Research', url: '/doctor/clinical-research', role: 'doctor' },
      { name: 'Finance Partners', url: '/doctor/finance-partners', role: 'doctor' },
      { name: 'Tele Health', url: '/doctor/coming-soon/tele-health', role: 'doctor' },
      { name: 'Remote Monitoring', url: '/doctor/coming-soon/remote-monitoring', role: 'doctor' },
    ];

    for (const page of pageItems) {
      if (page.role === 'both' || (page.role === 'doctor' && userRole === 'doctor') || (page.role === 'patient' && userRole === 'patient')) {
        const pageNameLower = page.name.toLowerCase();
        // Check if search term matches any word in the page name
        const pageWords = pageNameLower.split(/\s+/);
        const searchWords = pageSearchTerm.split(/\s+/);
        
        // Match if all search words are found in page name (as whole words or partial)
        const matches = searchWords.every(searchWord => 
          pageNameLower.includes(searchWord) || 
          pageWords.some(pageWord => pageWord.includes(searchWord) || searchWord.includes(pageWord))
        );
        
        if (matches) {
          pages.push({
            id: `page-${page.name}-${page.url}`,
            type: 'prescription' as const, // Reuse type for pages
            title: page.name,
            subtitle: 'Navigate to page',
            url: page.url,
            metadata: { isPage: true },
          });
        }
      }
    }

    if (pages.length > 0) {
      results.pages = pages;
      console.log('✅ Found pages:', pages.length);
    }

    // Helper to deduplicate results
    const deduplicate = (items: any[], key: string = 'id'): any[] => {
      const seen = new Set();
      return items.filter(item => {
        if (seen.has(item[key])) return false;
        seen.add(item[key]);
        return true;
      });
    };

    // Search Prescriptions - Doctor
    if (userRole === 'doctor') {
      try {
        // Search by title
        const { data: titleResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        // Search by description
        const { data: descResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        // Search by medication
        const { data: medResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('medication', searchPattern)
          .limit(10);

        const allPrescriptions = deduplicate([
          ...(titleResults || []),
          ...(descResults || []),
          ...(medResults || [])
        ]).slice(0, 10);

        if (allPrescriptions.length > 0) {
          results.prescriptions = allPrescriptions.map((p: any) => ({
            id: p.id,
            type: 'prescription' as const,
            title: p.title || 'Untitled Prescription',
            description: p.description,
            subtitle: `Medication: ${p.medication || 'N/A'} | Patient: ${p.profiles?.full_name || 'Unknown'}`,
            date: p.prescription_date,
            url: `/doctor/prescriptions`,
            metadata: { prescriptionId: p.id },
          }));
          console.log('✅ Found prescriptions (doctor):', results.prescriptions.length);
        }
      } catch (err) {
        console.error('❌ Error searching prescriptions (doctor):', err);
      }
    } else {
      // Patient view
      try {
        const { data: titleResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date')
          .eq('patient_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        const { data: descResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date')
          .eq('patient_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        const { data: medResults } = await supabase
          .from('prescriptions')
          .select('id, title, description, medication, prescription_date')
          .eq('patient_id', profileId)
          .ilike('medication', searchPattern)
          .limit(10);

        const allPrescriptions = deduplicate([
          ...(titleResults || []),
          ...(descResults || []),
          ...(medResults || [])
        ]).slice(0, 10);

        if (allPrescriptions.length > 0) {
          results.prescriptions = allPrescriptions.map((p: any) => ({
            id: p.id,
            type: 'prescription' as const,
            title: p.title || 'Untitled Prescription',
            description: p.description,
            subtitle: `Medication: ${p.medication || 'N/A'}`,
            date: p.prescription_date,
            url: `/prescriptions`,
            metadata: { prescriptionId: p.id },
          }));
          console.log('✅ Found prescriptions (patient):', results.prescriptions.length);
        }
      } catch (err) {
        console.error('❌ Error searching prescriptions (patient):', err);
      }
    }

    // Search Health Records
    try {
      const { data: titleResults } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .ilike('title', searchPattern)
        .limit(10);

      const { data: descResults } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', userId)
        .ilike('description', searchPattern)
        .limit(10);

      const allRecords = deduplicate([
        ...(titleResults || []),
        ...(descResults || [])
      ]).slice(0, 10);

      if (allRecords.length > 0) {
        results.healthRecords = allRecords.map((hr: any) => ({
          id: hr.id,
          type: 'health_record' as const,
          title: hr.title || 'Untitled Record',
          description: hr.description,
          subtitle: `Type: ${hr.record_type || 'Unknown'} | Date: ${hr.service_date ? new Date(hr.service_date).toLocaleDateString() : 'N/A'}`,
          date: hr.service_date,
          url: userRole === 'doctor' ? `/doctor/patients` : `/health-records`,
          metadata: { recordId: hr.id, recordType: hr.record_type },
        }));
        console.log('✅ Found health records:', results.healthRecords.length);
      }
    } catch (err) {
      console.error('❌ Error searching health records:', err);
    }

    // Search Consultations - Doctor
    if (userRole === 'doctor') {
      try {
        const { data: reasonResults } = await supabase
          .from('consultations')
          .select('id, reason, notes, consultation_date, consultation_time, status, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('reason', searchPattern)
          .limit(10);

        const { data: notesResults } = await supabase
          .from('consultations')
          .select('id, reason, notes, consultation_date, consultation_time, status, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('notes', searchPattern)
          .limit(10);

        const allConsultations = deduplicate([
          ...(reasonResults || []),
          ...(notesResults || [])
        ]).slice(0, 10);

        if (allConsultations.length > 0) {
          results.consultations = allConsultations.map((c: any) => ({
            id: c.id,
            type: 'consultation' as const,
            title: c.reason || 'Consultation',
            description: c.notes,
            subtitle: `Patient: ${c.profiles?.full_name || 'Unknown'} | Status: ${c.status || 'N/A'}`,
            date: c.consultation_date,
            url: `/doctor/consultations`,
            metadata: { consultationId: c.id },
          }));
          console.log('✅ Found consultations (doctor):', results.consultations.length);
        }
      } catch (err) {
        console.error('❌ Error searching consultations (doctor):', err);
      }
    } else {
      // Patient view
      try {
        const { data: reasonResults } = await supabase
          .from('consultations')
          .select('id, reason, notes, consultation_date, consultation_time, status')
          .eq('patient_id', profileId)
          .ilike('reason', searchPattern)
          .limit(10);

        const { data: notesResults } = await supabase
          .from('consultations')
          .select('id, reason, notes, consultation_date, consultation_time, status')
          .eq('patient_id', profileId)
          .ilike('notes', searchPattern)
          .limit(10);

        const allConsultations = deduplicate([
          ...(reasonResults || []),
          ...(notesResults || [])
        ]).slice(0, 10);

        if (allConsultations.length > 0) {
          results.consultations = allConsultations.map((c: any) => ({
            id: c.id,
            type: 'consultation' as const,
            title: c.reason || 'Consultation',
            description: c.notes,
            subtitle: `Status: ${c.status || 'N/A'}`,
            date: c.consultation_date,
            url: `/consultations`,
            metadata: { consultationId: c.id },
          }));
          console.log('✅ Found consultations (patient):', results.consultations.length);
        }
      } catch (err) {
        console.error('❌ Error searching consultations (patient):', err);
      }
    }

    // Search Consultation Notes - Doctor
    if (userRole === 'doctor') {
      try {
        const { data: titleResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        const { data: descResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        const { data: diagResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('diagnosis', searchPattern)
          .limit(10);

        const allNotes = deduplicate([
          ...(titleResults || []),
          ...(descResults || []),
          ...(diagResults || [])
        ]).slice(0, 10);

        if (allNotes.length > 0) {
          results.consultationNotes = allNotes.map((cn: any) => ({
            id: cn.id,
            type: 'consultation_note' as const,
            title: cn.title || 'Consultation Note',
            description: cn.description,
            subtitle: `Diagnosis: ${cn.diagnosis || 'N/A'} | Patient: ${cn.profiles?.full_name || 'Unknown'}`,
            date: cn.consultation_date,
            url: `/doctor/consultation-notes`,
            metadata: { noteId: cn.id },
          }));
          console.log('✅ Found consultation notes (doctor):', results.consultationNotes.length);
        }
      } catch (err) {
        console.error('❌ Error searching consultation notes (doctor):', err);
      }
    } else {
      // Patient view
      try {
        const { data: titleResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date')
          .eq('patient_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        const { data: descResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date')
          .eq('patient_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        const { data: diagResults } = await supabase
          .from('consultation_notes')
          .select('id, title, description, diagnosis, consultation_date')
          .eq('patient_id', profileId)
          .ilike('diagnosis', searchPattern)
          .limit(10);

        const allNotes = deduplicate([
          ...(titleResults || []),
          ...(descResults || []),
          ...(diagResults || [])
        ]).slice(0, 10);

        if (allNotes.length > 0) {
          results.consultationNotes = allNotes.map((cn: any) => ({
            id: cn.id,
            type: 'consultation_note' as const,
            title: cn.title || 'Consultation Note',
            description: cn.description,
            subtitle: `Diagnosis: ${cn.diagnosis || 'N/A'}`,
            date: cn.consultation_date,
            url: `/consultation-notes`,
            metadata: { noteId: cn.id },
          }));
          console.log('✅ Found consultation notes (patient):', results.consultationNotes.length);
        }
      } catch (err) {
        console.error('❌ Error searching consultation notes (patient):', err);
      }
    }

    // Search Patients (only for doctors)
    if (userRole === 'doctor') {
      try {
        const { data: nameResults } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number')
          .eq('role', 'patient')
          .ilike('full_name', searchPattern)
          .limit(10);

        const { data: emailResults } = await supabase
          .from('profiles')
          .select('id, full_name, email, phone_number')
          .eq('role', 'patient')
          .ilike('email', searchPattern)
          .limit(10);

        const allPatients = deduplicate([
          ...(nameResults || []),
          ...(emailResults || [])
        ]).slice(0, 10);

        if (allPatients.length > 0) {
          results.patients = allPatients.map((p: any) => ({
            id: p.id,
            type: 'patient' as const,
            title: p.full_name || 'Unknown Patient',
            subtitle: `Email: ${p.email || 'N/A'}${p.phone_number ? ` | Phone: ${p.phone_number}` : ''}`,
            url: `/doctor/patients`,
            metadata: { patientId: p.id },
          }));
          console.log('✅ Found patients:', results.patients.length);
        }
      } catch (err) {
        console.error('❌ Error searching patients:', err);
      }
    }

    // Search Consents - Doctor
    if (userRole === 'doctor') {
      try {
        const { data: titleResults } = await supabase
          .from('consents')
          .select('id, title, description, consent_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        const { data: descResults } = await supabase
          .from('consents')
          .select('id, title, description, consent_date, patient_id, profiles:patient_id(full_name, email)')
          .eq('doctor_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        const allConsents = deduplicate([
          ...(titleResults || []),
          ...(descResults || [])
        ]).slice(0, 10);

        if (allConsents.length > 0) {
          results.consents = allConsents.map((c: any) => ({
            id: c.id,
            type: 'consent' as const,
            title: c.title || 'Consent',
            description: c.description,
            subtitle: `Patient: ${c.profiles?.full_name || 'Unknown'}`,
            date: c.consent_date,
            url: `/doctor/consents`,
            metadata: { consentId: c.id },
          }));
          console.log('✅ Found consents (doctor):', results.consents.length);
        }
      } catch (err) {
        console.error('❌ Error searching consents (doctor):', err);
      }
    } else {
      // Patient view
      try {
        const { data: titleResults } = await supabase
          .from('consents')
          .select('id, title, description, consent_date')
          .eq('patient_id', profileId)
          .ilike('title', searchPattern)
          .limit(10);

        const { data: descResults } = await supabase
          .from('consents')
          .select('id, title, description, consent_date')
          .eq('patient_id', profileId)
          .ilike('description', searchPattern)
          .limit(10);

        const allConsents = deduplicate([
          ...(titleResults || []),
          ...(descResults || [])
        ]).slice(0, 10);

        if (allConsents.length > 0) {
          results.consents = allConsents.map((c: any) => ({
            id: c.id,
            type: 'consent' as const,
            title: c.title || 'Consent',
            description: c.description,
            date: c.consent_date,
            url: `/consent-management`,
            metadata: { consentId: c.id },
          }));
          console.log('✅ Found consents (patient):', results.consents.length);
        }
      } catch (err) {
        console.error('❌ Error searching consents (patient):', err);
      }
    }

    // Calculate total
    results.total =
      results.prescriptions.length +
      results.healthRecords.length +
      results.consultations.length +
      results.consultationNotes.length +
      results.patients.length +
      results.consents.length +
      results.pages.length;

    console.log('📊 Search completed:', {
      total: results.total,
      prescriptions: results.prescriptions.length,
      healthRecords: results.healthRecords.length,
      consultations: results.consultations.length,
      consultationNotes: results.consultationNotes.length,
      patients: results.patients.length,
      consents: results.consents.length,
      pages: results.pages.length,
    });

    return results;
  } catch (error) {
    console.error('❌ Error in searchAll:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return results;
  }
};
