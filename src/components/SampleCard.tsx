import React from 'react';
import { Star, Heart, Share2 } from 'lucide-react';

interface SampleCardProps {
  title: string;
  description: string;
  variant?: 'primary' | 'secondary' | 'accent';
  showButton?: boolean;
}

const SampleCard: React.FC<SampleCardProps> = ({ 
  title, 
  description, 
  variant = 'primary', 
  showButton = false 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'border-blue-200 hover:border-blue-300 hover:shadow-blue-100';
      case 'secondary':
        return 'border-green-200 hover:border-green-300 hover:shadow-green-100';
      case 'accent':
        return 'border-purple-200 hover:border-purple-300 hover:shadow-purple-100';
      default:
        return 'border-gray-200 hover:border-gray-300 hover:shadow-gray-100';
    }
  };

  const getButtonClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'accent':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      default:
        return 'bg-gray-600 hover:bg-gray-700 text-white';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return 'text-blue-600';
      case 'secondary':
        return 'text-green-600';
      case 'accent':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`bg-white rounded-xl p-6 border-2 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 ${getVariantClasses()}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <Star className={`h-5 w-5 ${getIconColor()}`} />
      </div>
      
      <p className="text-gray-600 mb-6 leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Heart className="h-4 w-4 text-gray-500 hover:text-red-500" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Share2 className="h-4 w-4 text-gray-500 hover:text-blue-500" />
          </button>
        </div>
        
        {showButton && (
          <button className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${getButtonClasses()}`}>
            Learn More
          </button>
        )}
      </div>
    </div>
  );
};

export default SampleCard;