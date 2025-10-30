import React, { useState, useMemo, useCallback, memo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Calendar,
  Clock, 
  User, 
  Stethoscope, 
  Briefcase, 
  Activity, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Bell,
  Shield
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  event_type: 'consultation' | 'blocked' | 'followup' | 'meeting' | 'reminder';
  status: 'pending' | 'confirmed' | 'cancelled' | 'rejected';
  patient_name?: string;
  notes?: string;
  doctor_id: string;
  patient_id?: string;
  is_available: boolean;
}

interface EnhancedCalendarComponentProps {
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEvent: (date: Date) => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onApproveEvent?: (eventId: string) => void;
  onRejectEvent?: (eventId: string) => void;
  onDayViewClick?: (date: Date) => void;
  view?: 'month' | 'week';
  onViewChange?: (view: 'month' | 'week') => void;
  showNavigation?: boolean;
  showAddButton?: boolean;
}

const EnhancedCalendarComponent: React.FC<EnhancedCalendarComponentProps> = memo(({
  events,
  onDateClick,
  onEventClick,
  onAddEvent,
  onEditEvent,
  onApproveEvent,
  onRejectEvent,
  onDayViewClick,
  view = 'month',
  onViewChange,
  showNavigation = true,
  showAddButton = true
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());


  const getEventIcon = useCallback((eventType: string, status: string) => {
    if (eventType === 'consultation') {
      if (status === 'pending') return <AlertCircle className="h-3 w-3" />;
      if (status === 'confirmed') return <CheckCircle className="h-3 w-3" />;
      if (status === 'rejected') return <XCircle className="h-3 w-3" />;
      return <Stethoscope className="h-3 w-3" />;
    }
    
    switch (eventType) {
      case 'blocked':
        return <Shield className="h-3 w-3" />;
      case 'followup':
        return <Bell className="h-3 w-3" />;
      case 'meeting':
        return <Briefcase className="h-3 w-3" />;
      case 'reminder':
        return <Activity className="h-3 w-3" />;
      default:
        return <CalendarIcon className="h-3 w-3" />;
    }
  }, []);

  const getEventColor = useCallback((eventType: string, status: string) => {
    if (eventType === 'consultation') {
      if (status === 'pending') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800';
      if (status === 'confirmed') return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800';
      if (status === 'rejected') return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800'; // Default to green for confirmed consultations
    }
    
    switch (eventType) {
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800';
      case 'followup':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800';
      case 'meeting':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800';
      case 'reminder':
        return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200 border-indigo-200 dark:border-indigo-800';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-200 dark:border-gray-700';
    }
  }, []);

  const getEventBadgeVariant = useCallback((eventType: string, status: string) => {
    if (eventType === 'consultation') {
      if (status === 'pending') return 'warning';
      if (status === 'confirmed') return 'success';
      if (status === 'rejected') return 'destructive';
      return 'default';
    }
    
    switch (eventType) {
      case 'blocked':
        return 'destructive';
      case 'followup':
        return 'default';
      case 'meeting':
        return 'secondary';
      case 'reminder':
        return 'outline';
      default:
        return 'default';
    }
  }, []);

  const getEventsForDate = useCallback((date: Date) => {
    const dayEvents = events.filter(event => 
      isSameDay(event.start, date) || 
      (event.start <= date && event.end >= date)
    );
    console.log(`Events for ${date.toDateString()}:`, dayEvents);
    return dayEvents;
  }, [events]);

  const renderMonthView = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        // Create a new date object for each cell to avoid mutation issues
        const cellDate = new Date(day);
        const dayEvents = getEventsForDate(cellDate);
        const isCurrentMonth = isSameMonth(cellDate, monthStart);
        const isToday = isSameDay(cellDate, new Date());


        days.push(
          <div
            key={cellDate.toString()}
            className={`
              calendar-day min-h-[90px] md:min-h-[120px] p-2 md:p-3 border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800
              ${isCurrentMonth ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-950 text-gray-400 dark:text-gray-500'}
              ${isToday ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}
            `}
            onClick={() => onDateClick(cellDate)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs md:text-sm font-medium ${isToday ? 'text-blue-600 dark:text-blue-400' : 'dark:text-gray-200'}`}>
                {format(cellDate, dateFormat)}
              </span>
              <div className="flex gap-1">
                {onDayViewClick && isCurrentMonth && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 opacity-100 hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDayViewClick(cellDate);
                        }}
                    title="Open day view"
                  >
                    <Calendar className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-1">
              {dayEvents.slice(0, 3).map((event) => {
                const colorClass = getEventColor(event.event_type, event.status);
                return (
                  <div
                    key={event.id}
                    className={`
                      text-[10px] md:text-xs p-1 rounded border cursor-pointer
                      ${colorClass}
                    `}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      if (onEditEvent) {
                        onEditEvent(event);
                      }
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (onEditEvent) {
                        onEditEvent(event);
                      }
                    }}
                    title="Click to view details, double-click or right-click to edit"
                  >
                    <div className="flex items-center gap-1">
                      {getEventIcon(event.event_type, event.status)}
                      <span className="truncate">{event.title}</span>
                    </div>
                    {event.patient_name && (
                      <div className="text-xs opacity-75 truncate">
                        {event.patient_name}
                      </div>
                    )}
                  </div>
                );
              })}
              {dayEvents.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{dayEvents.length - 3} more
                </div>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-0">
          {days}
        </div>
      );
      days = [];
    }

    return rows;
  }, [currentDate, events, getEventsForDate, getEventColor, getEventIcon, onDateClick, onAddEvent, onEventClick, showAddButton]);

  const renderWeekView = useMemo(() => {
    const weekStart = startOfWeek(currentDate);
    const weekEnd = endOfWeek(weekStart);
    const days = [];
    let day = weekStart;

    while (day <= weekEnd) {
      const dayEvents = getEventsForDate(day);
      const isToday = isSameDay(day, new Date());

      days.push(
        <div
          key={day.toString()}
          className={`
            min-h-[200px] p-3 border border-gray-200 dark:border-gray-700
            ${isToday ? 'bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500 dark:ring-blue-400' : 'bg-white dark:bg-gray-900'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-medium dark:text-gray-200">{format(day, 'EEEE')}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{format(day, 'MMM d')}</div>
            </div>
            {showAddButton && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddEvent(day)}
              >
                Add Event
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className={`
                  p-2 rounded border cursor-pointer
                  ${getEventColor(event.event_type, event.status)}
                `}
                onClick={() => onEventClick(event)}
              >
                <div className="flex items-center gap-2">
                  {getEventIcon(event.event_type, event.status)}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{event.title}</div>
                    {event.patient_name && (
                      <div className="text-xs opacity-75 truncate">
                        {event.patient_name}
                      </div>
                    )}
                    <div className="text-xs opacity-75">
                      {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                    </div>
                  </div>
                </div>
                {event.event_type === 'consultation' && event.status === 'pending' && onApproveEvent && onRejectEvent && (
                  <div className="flex gap-1 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onApproveEvent(event.id);
                      }}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRejectEvent(event.id);
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }

    return (
      <div className="grid grid-cols-7 gap-0">
        {days}
      </div>
    );
  }, [currentDate, events, getEventsForDate, getEventColor, getEventIcon, onAddEvent, onEventClick, onApproveEvent, onRejectEvent, showAddButton]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Schedule
          </CardTitle>
          <div className="flex items-center gap-2">
          {showNavigation && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentDate, 'MMMM yyyy')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          {onViewChange && (
            <div className="flex border rounded-md">
              <Button
                variant={view === 'month' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('month')}
              >
                Month
              </Button>
              <Button
                variant={view === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('week')}
              >
                Week
              </Button>
            </div>
          )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="border-t">
          {view === 'month' ? (
            <div className="space-y-0 overflow-x-auto">
              {/* Days of week header */}
              <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 min-w-[700px] md:min-w-0">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                    {day}
                  </div>
                ))}
            </div>
              {/* Month grid */}
              <div className="min-h-[320px] md:min-h-[400px] min-w-[700px] md:min-w-0">
                {/* Ensure date cell sizing scales on small screens */}
                <div className="[&_.calendar-day]:min-h-[90px] md:[&_.calendar-day]:min-h-[120px]" />
                {renderMonthView}
              </div>
            </div>
          ) : (
            renderWeekView
          )}
        </div>
        
        {/* Legend */}
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span>Consultations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span>Blocked Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span>Follow-ups</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-purple-500"></div>
              <span>Meetings</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-indigo-500"></div>
              <span>Reminders</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

EnhancedCalendarComponent.displayName = 'EnhancedCalendarComponent';

export default EnhancedCalendarComponent;
