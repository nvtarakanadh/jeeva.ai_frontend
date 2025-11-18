import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, FileText, Calendar, User, FileCheck, Stethoscope, Loader2 } from 'lucide-react';
import { searchAll, SearchResult, SearchResults } from '@/services/searchService';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const query = searchParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query && user) {
      performSearch(query);
    }
  }, [query, user]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim() || !user) {
      console.log('Search skipped - no term or user:', { searchTerm, user: !!user });
      return;
    }

    console.log('🔍 Starting search:', { searchTerm, userId: user.id, role: user.role });
    setIsLoading(true);
    setHasSearched(true);
    try {
      const searchResults = await searchAll(searchTerm, user.id, user.role || 'patient');
      console.log('✅ Search completed:', { total: searchResults.total, results: searchResults });
      setResults(searchResults);
    } catch (error) {
      console.error('❌ Search error:', error);
      setResults({
        prescriptions: [],
        healthRecords: [],
        consultations: [],
        consultationNotes: [],
        patients: [],
        consents: [],
        pages: [],
        total: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      performSearch(searchQuery.trim());
    }
  };

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
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

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
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
    }
  };

  const renderResults = (resultsList: SearchResult[], title: string) => {
    if (resultsList.length === 0) return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="space-y-2">
          {resultsList.map((result) => (
            <Card
              key={result.id}
              className="cursor-pointer hover:bg-accent transition-colors"
              onClick={() => handleResultClick(result)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">{getTypeIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">{result.title}</CardTitle>
                        <Badge variant="outline">{getTypeLabel(result.type)}</Badge>
                      </div>
                      {result.subtitle && (
                        <CardDescription className="text-sm">{result.subtitle}</CardDescription>
                      )}
                      {result.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                      {result.date && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {format(new Date(result.date), 'MMM dd, yyyy')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">Search across all your records and data</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search prescriptions, health records, consultations, patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 h-12 text-base"
            />
          </div>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>

        {/* Results */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && hasSearched && results && (
          <div className="space-y-8">
            {results.total === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground text-center">
                    Try different keywords or check your spelling
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Found {results.total} result{results.total !== 1 ? 's' : ''} for "{query}"
                  </p>
                </div>

                {renderResults(results.pages, 'Pages')}
                {renderResults(results.patients, 'Patients')}
                {renderResults(results.prescriptions, 'Prescriptions')}
                {renderResults(results.healthRecords, 'Health Records')}
                {renderResults(results.consultations, 'Consultations')}
                {renderResults(results.consultationNotes, 'Consultation Notes')}
                {renderResults(results.consents, 'Consents')}
              </>
            )}
          </div>
        )}

        {!hasSearched && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Start searching</h3>
              <p className="text-muted-foreground text-center">
                Enter a search term above to find prescriptions, health records, consultations, and more
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

