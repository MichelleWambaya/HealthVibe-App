'use client';

import Link from 'next/link';
import { Condition } from '@/lib/data';

interface ConditionCardProps {
  condition: Condition;
}

export default function ConditionCard({ condition }: ConditionCardProps) {
  const getCategoryColors = (category: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; accent: string } } = {
      respiratory: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-400' },
      reproductive: { bg: 'bg-pink-50', border: 'border-pink-200', accent: 'bg-pink-400' },
      digestive: { bg: 'bg-green-50', border: 'border-green-200', accent: 'bg-green-400' },
      mental: { bg: 'bg-yellow-50', border: 'border-yellow-200', accent: 'bg-yellow-400' },
      skin: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-400' },
      immune: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-400' },
    };
    return colorMap[category] || { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'bg-gray-400' };
  };

  const getSeverityColor = (severity: string) => {
    const colorMap: { [key: string]: string } = {
      Mild: 'text-green-600 bg-green-100',
      Moderate: 'text-yellow-600 bg-yellow-100',
      Severe: 'text-red-600 bg-red-100',
    };
    return colorMap[severity] || 'text-gray-600 bg-gray-100';
  };

  const colors = getCategoryColors(condition.category);

  return (
    <Link
      href={`/conditions/${condition.id}`}
      className="group block bg-white border border-gray-200 hover:border-blue-300 transition-all duration-300 p-4 hover:shadow-md"
    >
      {/* Condition Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className={`w-10 h-10 flex items-center justify-center mr-3 ${
            condition.category === 'reproductive' ? 'bg-pink-100' : 
            condition.category === 'respiratory' ? 'bg-blue-100' :
            condition.category === 'digestive' ? 'bg-green-100' :
            condition.category === 'mental' ? 'bg-yellow-100' :
            condition.category === 'skin' ? 'bg-purple-100' :
            'bg-orange-100'
          }`}>
            <svg className={`w-5 h-5 ${
              condition.category === 'reproductive' ? 'text-pink-600' : 
              condition.category === 'respiratory' ? 'text-blue-600' :
              condition.category === 'digestive' ? 'text-green-600' :
              condition.category === 'mental' ? 'text-yellow-600' :
              condition.category === 'skin' ? 'text-purple-600' :
              'text-orange-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {condition.name}
            </h2>
            <p className="text-xs text-gray-500">Home Remedy Solutions</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-green-400"></div>
          <span className="text-xs text-gray-500">Available</span>
        </div>
      </div>
      
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">
        {condition.description}
      </p>
      
      {/* Symptoms Preview */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-1">
          {condition.symptoms.slice(0, 2).map((symptom, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs">
              {symptom}
            </span>
          ))}
          {condition.symptoms.length > 2 && (
            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs">
              +{condition.symptoms.length - 2} more
            </span>
          )}
        </div>
      </div>

      {/* Footer with remedy count and action */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-blue-600 font-medium">
            {condition.remedies.length} remedy{condition.remedies.length !== 1 ? 'ies' : ''}
          </span>
          <span className={`px-1.5 py-0.5 text-xs font-medium ${getSeverityColor(condition.severity)}`}>
            {condition.severity}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-blue-500 group-hover:text-blue-600">
          <span className="text-xs font-medium">View</span>
          <svg 
            className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
