import React, { useState } from 'react';
import { Download, Send, Settings, Trash2, Eye, EyeOff } from 'lucide-react';

const ButtonShowcase: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Primary Buttons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            Primary Button
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Download
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center">
            <Send className="h-4 w-4 mr-2" />
            Send Message
          </button>
        </div>
      </div>

      {/* Secondary Buttons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Secondary Buttons</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium">
            Secondary
          </button>
          <button className="px-6 py-3 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200 font-medium flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Colored Variants */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Color Variants</h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
            Success
          </button>
          <button className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 font-medium">
            Warning
          </button>
          <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium flex items-center">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Interactive Buttons */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Examples</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setIsVisible(!isVisible)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium flex items-center"
          >
            {isVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {isVisible ? 'Hide' : 'Show'}
          </button>
          
          <button
            onClick={handleLoadingDemo}
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                Loading...
              </>
            ) : (
              'Load Demo'
            )}
          </button>
        </div>
        
        {isVisible && (
          <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-purple-800">
              🎉 This content is toggleable! Click the button above to hide/show it.
            </p>
          </div>
        )}
      </div>

      {/* Button Sizes */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Variants</h3>
        <div className="flex flex-wrap items-center gap-4">
          <button className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 transition-colors duration-200 font-medium">
            Small
          </button>
          <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors duration-200 font-medium">
            Medium
          </button>
          <button className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
            Large
          </button>
          <button className="px-8 py-4 bg-gray-600 text-white rounded-xl text-lg hover:bg-gray-700 transition-colors duration-200 font-medium">
            Extra Large
          </button>
        </div>
      </div>

      {/* Disabled State */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disabled State</h3>
        <div className="flex flex-wrap gap-4">
          <button disabled className="px-6 py-3 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium">
            Disabled Primary
          </button>
          <button disabled className="px-6 py-3 bg-white text-gray-400 rounded-lg border border-gray-200 cursor-not-allowed font-medium">
            Disabled Secondary
          </button>
        </div>
      </div>
    </div>
  );
};

export default ButtonShowcase;