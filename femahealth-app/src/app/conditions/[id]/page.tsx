import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ConditionPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const { id } = use(params);
  
  // For now, return a placeholder since the functions don't exist
  // TODO: Implement these functions in data.ts or remove this page
  const condition = null; // getConditionById(id);
  const category = null; // getCategoryById(condition?.category || '');

  if (!condition) {
    notFound();
  }

  const getCategoryColors = (categoryId: string) => {
    const colorMap: { [key: string]: { bg: string; border: string; accent: string; text: string } } = {
      respiratory: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'bg-blue-500', text: 'text-blue-800' },
      reproductive: { bg: 'bg-pink-50', border: 'border-pink-200', accent: 'bg-pink-500', text: 'text-pink-800' },
      digestive: { bg: 'bg-green-50', border: 'border-green-200', accent: 'bg-green-500', text: 'text-green-800' },
      mental: { bg: 'bg-yellow-50', border: 'border-yellow-200', accent: 'bg-yellow-500', text: 'text-yellow-800' },
      skin: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'bg-purple-500', text: 'text-purple-800' },
      immune: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'bg-orange-500', text: 'text-orange-800' },
    };
    return colorMap[categoryId] || { bg: 'bg-gray-50', border: 'border-gray-200', accent: 'bg-gray-500', text: 'text-gray-800' };
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
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>
        
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-2xl">{category?.icon}</span>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {condition.name}
            </h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(condition.severity)}`}>
                {condition.severity}
              </span>
              <span className="text-sm text-gray-500">
                {condition.ageGroup}
              </span>
            </div>
          </div>
        </div>
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">
          {condition.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className={`${colors.bg} rounded-xl shadow-lg p-6 border-2 ${colors.border}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-red-400 rounded-full mr-3"></span>
            Common Symptoms
          </h2>
          <ul className="space-y-3">
            {condition.symptoms.map((symptom, index) => (
              <li key={index} className="flex items-center">
                <span className={`w-2 h-2 ${colors.accent} rounded-full mr-3`}></span>
                <span className="text-gray-700">{symptom}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`${colors.bg} rounded-xl shadow-lg p-6 border-2 ${colors.border}`}>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
            Available Remedies
          </h2>
          <div className="space-y-4">
            {condition.remedies.map((remedy) => (
              <Link
                key={remedy.id}
                href={`/conditions/${condition.id}/remedies/${remedy.id}`}
                className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900">
                    {remedy.title}
                  </h3>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${i < remedy.effectiveness ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {remedy.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <span>⏱️ {remedy.prepTime}</span>
                    <span>📅 {remedy.duration}</span>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    remedy.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    remedy.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {remedy.difficulty}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          When to Seek Medical Attention
        </h3>
        <p className="text-yellow-700 text-sm leading-relaxed">
          If symptoms persist for more than a week, worsen significantly, or you experience 
          severe reactions to any remedy, please consult with a healthcare professional immediately. 
          These home remedies are not a substitute for professional medical care.
        </p>
      </div>
    </div>
  );
}
