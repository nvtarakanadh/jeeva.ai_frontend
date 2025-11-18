import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, FileText, Calendar, User, FileCheck, Stethoscope, Loader2, Search, Layout } from 'lucide-react';
import { SearchResult, SearchResults } from '@/services/searchService';
import { format } from 'date-fns';

interface SearchDropdownProps {
  results: SearchResults | null;
  isLoading: boolean;
  onResultClick?: () => void;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({ results, isLoading, onResultClick }) => {
  const navigate = useNavigate();

  const getTypeIcon = (result: SearchResult) => {
    // Check if it's a page
    if (result.metadata?.isPage) {
      return <Layout className="h-4 w-4" />;
    }
    
    switch (result.type) {
      case 'prescription':
        return <Pill className="h-4 w-4" />;
      case 'health_record':
        return <FileText className="h-4 w-4" />;
      case 'consultation':
        return <Calendar className="h-4 w-4" />;
      case 'consultation_note':
        return <Stethoscope className="h-4 w-4" />;
      case 'patient':
        return <User className="h-4 w-4" />;
      case 'consent':
        return <FileCheck className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (result: SearchResult) => {
    if (result.metadata?.isPage) {
      return 'Page';
    }
    
    switch (result.type) {
      case 'prescription':
        return 'Prescription';
      case 'health_record':
        return 'Health Record';
      case 'consultation':
        return 'Consultation';
      case 'consultation_note':
        return 'Consultation Note';
      case 'patient':
        return 'Patient';
      case 'consent':
        return 'Consent';
      default:
        return 'Record';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.url) {
      navigate(result.url);
      if (onResultClick) {
        onResultClick();
      }
    }
  };

  if (isLoading) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg border">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return null;
  }

  if (results.total === 0) {
    return (
      <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg border">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Search className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No results found</p>
          <p className="text-xs text-muted-foreground mt-1">Try different keywords</p>
        </CardContent>
      </Card>
    );
  }

  const allResults: SearchResult[] = [
    ...results.pages, // Show pages first
    ...results.patients,
    ...results.prescriptions,
    ...results.healthRecords,
    ...results.consultations,
    ...results.consultationNotes,
    ...results.consents,
  ].slice(0, 8); // Limit to 8 results for dropdown

  return (
    <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-y-auto shadow-lg">
      <CardContent className="p-2">
        <div className="space-y-1">
          {allResults.map((result) => (
            <div
              key={`${result.type}-${result.id}`}
              className="flex items-start gap-3 p-2 rounded-md hover:bg-accent cursor-pointer transition-colors"
              onClick={() => handleResultClick(result)}
            >
              <div className="mt-1 text-muted-foreground">{getTypeIcon(result)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm truncate">{result.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {getTypeLabel(result)}
                  </Badge>
                </div>
                {result.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">{result.subtitle}</p>
                )}
                {result.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {result.description}
                  </p>
                )}
                {result.date && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(result.date), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>
          ))}
          {results.total > 8 && (
            <div className="text-center py-2 text-xs text-muted-foreground">
              Showing 8 of {results.total} results
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchDropdown;

