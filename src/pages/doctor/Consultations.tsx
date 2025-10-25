import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle, Eye, PlusCircle, FileText, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { PageLoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/contexts/AuthContext';
import { getDoctorConsultations, Consultation } from '@/services/consultationService';
import { getPatientRecordsForDoctor } from '@/services/patientRecordsService';
import { getSharedRecordsForConsultation, type SharedRecord, debugConsentSystem } from '@/services/recordSharingService';
import AIAnalysisModal from '@/components/ai/AIAnalysisModal';
import { toast } from '@/hooks/use-toast';
import CreatePrescription from '@/components/prescription/CreatePrescription';
import AIAnalysisTags from '@/components/ai/AIAnalysisTags';
import { supabase } from '@/integrations/supabase/client';

const DoctorConsultations = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [patientRecords, setPatientRecords] = useState<any[]>([]);
  const [sharedRecords, setSharedRecords] = useState<SharedRecord[]>([]);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedRecordForAI, setSelectedRecordForAI] = useState<{
    id: string;
    title: string;
    type: string;
    description?: string;
    fileUrl?: string;
    fileName?: string;
    userId?: string;
  } | null>(null);
  const [viewingFile, setViewingFile] = useState<{ url: string; name: string; type: string } | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadConsultations();
    }
  }, [user?.id]);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      
      // First get the doctor's profile ID
      const { data: doctorProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user!.id)
        .single();

      if (profileError || !doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      const doctorId = (doctorProfile as { id: string }).id;
      const data = await getDoctorConsultations(doctorId);
      setConsultations(data);
    } catch (error) {
      console.error('Error loading consultations:', error);
      toast({
        title: "Error",
        description: "Failed to load consultations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPatientRecords = async (patientId: string) => {
    try {
      const records = await getPatientRecordsForDoctor(user!.id);
      const patientSpecificRecords = records.filter(record => record.patientId === patientId);
      setPatientRecords(patientSpecificRecords);
    } catch (error) {
      console.error('Error loading patient records:', error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive"
      });
    }
  };

  const handleViewConsultation = async (consultation: Consultation) => {
    // Reset modal states when selecting a new consultation
    setIsAIModalOpen(false);
    setSelectedRecordForAI(null);
    setViewingFile(null);
    
    setSelectedConsultation(consultation);
    if (consultation.status === 'confirmed' || consultation.status === 'scheduled') {
      await loadPatientRecords(consultation.patient_id);
      await loadSharedRecords(consultation.id);
    }
  };

  const loadSharedRecords = async (consultationId: string) => {
    try {
      
      // First run debug to see what's in the database
      await debugConsentSystem(consultationId);
      
      const records = await getSharedRecordsForConsultation(consultationId);
      setSharedRecords(records);
    } catch (error) {
      console.error('❌ Error loading shared records:', error);
      toast({
        title: "Error",
        description: "Failed to load shared records",
        variant: "destructive"
      });
    }
  };

  const getFileType = (fileName: string) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension || '')) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension || '')) return 'image';
    if (['doc', 'docx'].includes(extension || '')) return 'document';
    return 'file';
  };

  const openFileViewer = async (fileUrl: string, fileName: string) => {
    try {
      const fileType = getFileType(fileName);
      
      // If it's already a full URL, use it directly
      let displayUrl = fileUrl;
      
      // Check if it's a Supabase storage path and try different bucket names
      if (fileUrl && !fileUrl.startsWith('http')) {
        // Try different possible bucket names
        const possibleBuckets = ['medical-files', 'prescriptions', 'consultation-notes', 'health-records', 'files'];
        
        for (const bucket of possibleBuckets) {
          try {
            const { data } = supabase.storage
              .from(bucket)
              .getPublicUrl(fileUrl);
            
            if (data.publicUrl) {
              displayUrl = data.publicUrl;
              break;
            }
          } catch (bucketError) {
            // Continue to next bucket
          }
        }
      }
      
      setViewingFile({ url: displayUrl, name: fileName, type: fileType });
    } catch (error) {
      // Still try to open with the original URL
      const fileType = getFileType(fileName);
      setViewingFile({ url: fileUrl, name: fileName, type: fileType });
    }
  };

  const openAIModal = (record: SharedRecord) => {
    setSelectedRecordForAI({
      id: record.id,
      title: record.title,
      type: record.record_type,
      description: record.title,
      fileUrl: record.file_url,
      fileName: record.file_name,
      userId: selectedConsultation?.patient_id
    });
    setIsAIModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled_no_consent':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'scheduled_no_consent':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'confirmed':
        return 'Confirmed';
      case 'scheduled_no_consent':
        return 'Scheduled (No Consent)';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const upcomingConsultations = consultations.filter(c => 
    ['scheduled', 'confirmed', 'scheduled_no_consent'].includes(c.status)
  );
  const pastConsultations = consultations.filter(c => 
    ['completed', 'cancelled'].includes(c.status)
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Consultations</h1>
            <p className="text-muted-foreground">
              Manage your patient consultations and medical records access
            </p>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <PageLoadingSpinner text="Loading consultations..." />
        </div>
      </div>
    );
  }

  if (showPrescriptionForm && selectedConsultation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Create Prescription</h1>
            <p className="text-muted-foreground">
              Create a prescription for {selectedConsultation.patient?.full_name}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowPrescriptionForm(false)}>
            Back to Consultations
          </Button>
        </div>
        <CreatePrescription
          patientId={selectedConsultation.patient_id}
          patientName={selectedConsultation.patient?.full_name || 'Unknown Patient'}
          onPrescriptionCreated={() => {
            setShowPrescriptionForm(false);
            // Reset all modal states when prescription is created
            setIsAIModalOpen(false);
            setSelectedRecordForAI(null);
            setViewingFile(null);
            setSelectedConsultation(null);
            toast({
              title: "Prescription Created",
              description: "Prescription has been created successfully.",
            });
          }}
          onCancel={() => setShowPrescriptionForm(false)}
        />
      </div>
    );
  }

  if (selectedConsultation) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Consultation Details</h1>
            <p className="text-muted-foreground">
              {selectedConsultation.patient?.full_name} - {format(new Date(selectedConsultation.consultation_date), 'PPP')}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => {
              // Reset all modal states when going back
              setIsAIModalOpen(false);
              setSelectedRecordForAI(null);
              setViewingFile(null);
              setSelectedConsultation(null);
            }}>
              Back to Consultations
            </Button>
            {selectedConsultation.status === 'confirmed' && (
              <Button onClick={() => setShowPrescriptionForm(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Prescription
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Consultation Info */}
          <Card>
            <CardHeader>
              <CardTitle>Consultation Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient</p>
                  <p className="text-lg">{selectedConsultation.patient?.full_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p className="text-lg">{format(new Date(selectedConsultation.consultation_date), 'PPP')}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time</p>
                  <p className="text-lg">{selectedConsultation.consultation_time}</p>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Status</div>
                  <Badge className={getStatusColor(selectedConsultation.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(selectedConsultation.status)}
                      <span>{getStatusLabel(selectedConsultation.status)}</span>
                    </div>
                  </Badge>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reason for Consultation</p>
                <p className="text-sm">{selectedConsultation.reason}</p>
              </div>
              
              {selectedConsultation.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="text-sm">{selectedConsultation.notes}</p>
                </div>
              )}

              {selectedConsultation.status === 'scheduled_no_consent' && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    Patient has not granted access to medical records. Only basic information is available.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Records (if consent granted) */}
          {selectedConsultation.status === 'confirmed' && (
            <Card>
              <CardHeader>
                <CardTitle>Patient Medical Records</CardTitle>
                <CardDescription>
                  Available with patient consent
                </CardDescription>
              </CardHeader>
              <CardContent>
                {patientRecords.length === 0 ? (
                  <div className="text-center py-8">
                    <Stethoscope className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No medical records available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {patientRecords.map((record) => (
                      <div key={record.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {record.recordType} • {format(new Date(record.recordDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Patient Shared Records (if consent granted) */}
          {(selectedConsultation.status === 'confirmed' || selectedConsultation.status === 'scheduled') && sharedRecords.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Patient Shared Records</CardTitle>
                <CardDescription>
                  Records specifically shared for this consultation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sharedRecords.map((record) => {
                    return (
                    <div key={record.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-lg">{record.title}</h4>
                          <div className="text-sm text-muted-foreground">
                            {record.record_type} • {format(new Date(record.service_date), 'MMM dd, yyyy')}
                          </div>
                          {record.file_name && (
                            <div className="text-xs text-gray-500 mt-1">
                              File: {record.file_name}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {record.is_auto_matched && (
                            <Badge variant="secondary" className="text-xs">
                              Auto-matched
                            </Badge>
                          )}
                          {record.ai_analysis && (
                            <AIAnalysisTags 
                              priority={record.ai_analysis.priority}
                              riskLevel={record.ai_analysis.risk_level}
                            />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openAIModal(record)}
                            className="flex-1 sm:flex-none lg:flex-none justify-center sm:justify-start lg:justify-start h-10 sm:h-8 lg:h-8 touch-manipulation"
                          >
                            <Brain className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">AI Analytics</span>
                            <span className="sm:hidden">AI Analytics</span>
                          </Button>
                          {record.file_url && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openFileViewer(record.file_url || '', record.file_name || 'Unknown File')}
                              className="flex-1 sm:flex-none lg:flex-none justify-center sm:justify-start lg:justify-start h-10 sm:h-8 lg:h-8 touch-manipulation"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">View File</span>
                              <span className="sm:hidden">View</span>
                            </Button>
                          )}
                        </div>
                        {record.access_expires_at && (
                          <div className="text-xs text-gray-500">
                            Access until: {format(new Date(record.access_expires_at), 'MMM dd, yyyy')}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  const FileViewer = () => {
    if (!viewingFile) return null;

    return (
      <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {viewingFile.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            {viewingFile.type === 'pdf' && (
              <div className="w-full h-[70vh] border rounded-lg">
                <iframe
                  src={viewingFile.url}
                  className="w-full h-full border-0 rounded-lg"
                  title={viewingFile.name}
                  onError={(e) => {
                    console.error('Error loading PDF:', e);
                  }}
                />
              </div>
            )}
            {viewingFile.type === 'image' && (
              <div className="flex items-center justify-center h-[70vh] bg-gray-50 rounded-lg">
                <div className="text-center">
                  <img
                    src={viewingFile.url}
                    alt={viewingFile.name}
                    className="max-w-full max-h-[60vh] object-contain mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-gray-600">If image doesn't load, try these options:</p>
                    <div className="flex gap-2 justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(viewingFile.url, '_blank')}
                      >
                        Open in New Tab
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = viewingFile.url;
                          link.download = viewingFile.name;
                          link.click();
                        }}
                      >
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 break-all">
                      URL: {viewingFile.url}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {viewingFile.type === 'document' && (
              <div className="flex items-center justify-center h-[70vh] bg-gray-100 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium">Document Preview</p>
                  <p className="text-sm text-gray-500 mb-4">{viewingFile.name}</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Document preview not available in browser.
                  </p>
                  <Button 
                    onClick={() => window.open(viewingFile.url, '_blank')}
                    variant="outline"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
            {viewingFile.type === 'file' && (
              <div className="flex items-center justify-center h-[70vh] bg-gray-100 rounded-lg">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium">File Preview</p>
                  <p className="text-sm text-gray-500 mb-4">{viewingFile.name}</p>
                  <p className="text-sm text-gray-400 mb-4">
                    File preview not available in browser.
                  </p>
                  <Button 
                    onClick={() => window.open(viewingFile.url, '_blank')}
                    variant="outline"
                  >
                    Open in New Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Consultations</h1>
          <p className="text-muted-foreground">
            Manage your patient consultations and medical records access
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingConsultations.length}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled appointments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">With Consent</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.status === 'confirmed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Full access granted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {consultations.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Past consultations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Consultations Tabs */}
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingConsultations.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastConsultations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingConsultations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No upcoming consultations</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {consultation.patient?.full_name}
                        </CardTitle>
                        <Badge className={getStatusColor(consultation.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(consultation.status)}
                            <span>{getStatusLabel(consultation.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(consultation.consultation_date), 'PPP')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.consultation_time}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewConsultation(consultation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{consultation.patient?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{consultation.consultation_time}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Reason for Consultation:</h4>
                        <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                      </div>
                      {consultation.notes && (
                        <div>
                          <h4 className="font-medium text-sm">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastConsultations.length === 0 ? (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <p className="text-muted-foreground">No past consultations</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">
                          {consultation.patient?.full_name}
                        </CardTitle>
                        <Badge className={getStatusColor(consultation.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(consultation.status)}
                            <span>{getStatusLabel(consultation.status)}</span>
                          </div>
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {format(new Date(consultation.consultation_date), 'PPP')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {consultation.consultation_time}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewConsultation(consultation)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{consultation.patient?.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{consultation.consultation_time}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <h4 className="font-medium text-sm">Reason for Consultation:</h4>
                        <p className="text-sm text-muted-foreground">{consultation.reason}</p>
                      </div>
                      {consultation.notes && (
                        <div>
                          <h4 className="font-medium text-sm">Notes:</h4>
                          <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* File Viewer Modal */}
      {viewingFile && (
        <Dialog open={!!viewingFile} onOpenChange={() => setViewingFile(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                {viewingFile.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-auto">
              {viewingFile.type === 'pdf' && (
                <div className="w-full h-[70vh] border rounded-lg">
                  <iframe
                    src={viewingFile.url}
                    className="w-full h-full border-0 rounded-lg"
                    title={viewingFile.name}
                    onError={(e) => {
                      console.error('Error loading PDF:', e);
                    }}
                  />
                </div>
              )}
              {viewingFile.type === 'image' && (
                <div className="flex items-center justify-center h-[70vh] bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <img
                      src={viewingFile.url}
                      alt={viewingFile.name}
                      className="max-w-full max-h-[60vh] object-contain mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className="mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(viewingFile.url, '_blank')}
                      >
                        Open in New Tab
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = viewingFile.url;
                          link.download = viewingFile.name;
                          link.click();
                        }}
                      >
                        Download
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 break-all">
                      URL: {viewingFile.url}
                    </p>
                  </div>
                </div>
              )}
              {viewingFile.type === 'document' && (
                <div className="flex items-center justify-center h-[70vh] bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium">Document Preview</p>
                    <p className="text-sm text-gray-500 mb-4">{viewingFile.name}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      Document preview not available in browser.
                    </p>
                    <Button 
                      onClick={() => window.open(viewingFile.url, '_blank')}
                      variant="outline"
                    >
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}
              {viewingFile.type === 'file' && (
                <div className="flex items-center justify-center h-[70vh] bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-lg font-medium">File Preview</p>
                    <p className="text-sm text-gray-500 mb-4">{viewingFile.name}</p>
                    <p className="text-sm text-gray-400 mb-4">
                      File preview not available in browser.
                    </p>
                    <Button 
                      onClick={() => window.open(viewingFile.url, '_blank')}
                      variant="outline"
                    >
                      Open in New Tab
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t">
              <p className="text-sm text-gray-500 truncate max-w-md">
                URL: {viewingFile.url}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(viewingFile.url, '_blank')}
                >
                  Open in New Tab
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = viewingFile.url;
                    link.download = viewingFile.name;
                    link.click();
                  }}
                >
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Analysis Modal */}
      {selectedRecordForAI && (
        <AIAnalysisModal
          isOpen={isAIModalOpen}
          onClose={() => {
            setIsAIModalOpen(false);
            setSelectedRecordForAI(null);
          }}
          recordId={selectedRecordForAI.id}
          recordTitle={selectedRecordForAI.title}
          recordType={selectedRecordForAI.type}
          recordDescription={selectedRecordForAI.description}
          fileUrl={selectedRecordForAI.fileUrl}
          fileName={selectedRecordForAI.fileName}
          patientId={selectedRecordForAI.userId}
        />
      )}

      {/* File Viewer Modal */}
      <FileViewer />
    </div>
  );
};

export default DoctorConsultations;
