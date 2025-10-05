'use client';

import { useState } from 'react';
import { categories, getConditionsByCategory } from '@/lib/data';

interface CategoryFilterProps {
  onCategorySelect: (categoryId: string, conditions: any[]) => void;
  selectedCategory: string;
}

export default function CategoryFilter({ onCategorySelect, selectedCategory }: CategoryFilterProps) {

  const getCategoryColors = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300',
      pink: 'bg-pink-100 hover:bg-pink-200 text-pink-800 border-pink-300',
      green: 'bg-green-100 hover:bg-green-200 text-green-800 border-green-300',
      yellow: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300',
      purple: 'bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-300',
      orange: 'bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-300',
    };
    return colorMap[color] || 'bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300';
  };

  const getSelectedColors = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: 'bg-blue-500 text-white border-blue-500',
      pink: 'bg-pink-500 text-white border-pink-500',
      green: 'bg-green-500 text-white border-green-500',
      yellow: 'bg-yellow-500 text-white border-yellow-500',
      purple: 'bg-purple-500 text-white border-purple-500',
      orange: 'bg-orange-500 text-white border-orange-500',
    };
    return colorMap[color] || 'bg-gray-500 text-white border-gray-500';
  };

  const handleCategoryClick = (categoryId: string) => {
    const conditions = getConditionsByCategory(categoryId);
    onCategorySelect(categoryId, conditions);
  };

      return (
        <div className="mb-6">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Categories</h2>
            <p className="text-sm text-gray-600">Choose your health category to find the right remedies</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 max-w-4xl mx-auto">
            <button
              onClick={() => onCategorySelect('all', [])}
              className={`p-3 border-2 transition-all duration-200 font-medium text-center ${
                selectedCategory === 'all'
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white hover:bg-blue-50 text-gray-800 border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="w-6 h-6 bg-blue-100 flex items-center justify-center mb-1 mx-auto">
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-xs font-medium">All</div>
            </button>
        
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-3 border-2 transition-all duration-200 font-medium text-center ${
                  selectedCategory === category.id
                    ? getSelectedColors(category.color)
                    : getCategoryColors(category.color)
                }`}
              >
                <div className={`w-6 h-6 flex items-center justify-center mb-1 mx-auto ${
                  selectedCategory === category.id ? 'bg-white bg-opacity-20' : 'bg-gray-100'
                }`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                {category.id === 'respiratory' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
                {category.id === 'reproductive' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
                {category.id === 'digestive' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
                {category.id === 'mental' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
                {category.id === 'skin' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
                {category.id === 'immune' && (
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                )}
              </svg>
            </div>
                <div className="text-xs font-medium">{category.name.split(' ')[0]}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
