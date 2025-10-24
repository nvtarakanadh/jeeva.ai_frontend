import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AIAnalysisTagsProps {
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  riskLevel?: 'critical' | 'high' | 'medium' | 'low';
  className?: string;
}

const AIAnalysisTags: React.FC<AIAnalysisTagsProps> = ({ 
  priority, 
  riskLevel, 
  className = '' 
}) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="h-3 w-3" />,
          text: 'Urgent'
        };
      case 'high':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'High Priority'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Info className="h-3 w-3" />,
          text: 'Medium Priority'
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Low Priority'
        };
      default:
        return null;
    }
  };

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertTriangle className="h-3 w-3" />,
          text: 'Critical Risk'
        };
      case 'high':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: <AlertCircle className="h-3 w-3" />,
          text: 'High Risk'
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Info className="h-3 w-3" />,
          text: 'Medium Risk'
        };
      case 'low':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Low Risk'
        };
      default:
        return null;
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {priority && getPriorityConfig(priority) && (
        <Badge 
          variant="outline" 
          className={`text-xs ${getPriorityConfig(priority)!.color}`}
        >
          {getPriorityConfig(priority)!.icon}
          <span className="ml-1">{getPriorityConfig(priority)!.text}</span>
        </Badge>
      )}
      {riskLevel && getRiskConfig(riskLevel) && (
        <Badge 
          variant="outline" 
          className={`text-xs ${getRiskConfig(riskLevel)!.color}`}
        >
          {getRiskConfig(riskLevel)!.icon}
          <span className="ml-1">{getRiskConfig(riskLevel)!.text}</span>
        </Badge>
      )}
    </div>
  );
};

export default AIAnalysisTags;
