import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";

interface PageProps {
  params: Promise<{
    id: string;
    remedyId: string;
  }>;
}

export default function RemedyPage({ params }: PageProps) {
  // Unwrap the params Promise using React.use()
  const { id, remedyId } = use(params);
  
  // For now, return a placeholder since the functions don't exist
  // TODO: Implement these functions in data.ts or remove this page
  const condition = null; // getConditionById(id);
  const remedy = null; // getRemedyById(id, remedyId);

  if (!condition || !remedy) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link href={`/conditions/${condition.id}`} className="hover:text-blue-600">
            {condition.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{remedy.title}</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {remedy.title}
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          {remedy.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {remedy.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="text-gray-700">{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Instructions
            </h2>
            <ol className="space-y-3">
              {remedy.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full mr-3 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span className="text-gray-700">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Treatment Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Duration</h3>
                <p className="text-gray-600">{remedy.duration}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Frequency</h3>
                <p className="text-gray-600">{remedy.frequency}</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-4">
              Important Warnings
            </h2>
            <ul className="space-y-2">
              {remedy.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 text-sm">{warning}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Related Condition
            </h3>
            <p className="text-blue-800 text-sm mb-3">
              This remedy is for: <strong>{condition.name}</strong>
            </p>
            <Link
              href={`/conditions/${condition.id}`}
              className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
            >
              View all remedies for {condition.name}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

