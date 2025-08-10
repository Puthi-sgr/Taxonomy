import React, { useState } from 'react';
import { Code, Plus, Play } from 'lucide-react';
import SampleCard from '../components/SampleCard';
import ButtonShowcase from '../components/ButtonShowcase';

const Components: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<string>('cards');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Component Playground
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Test and showcase your React components here
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto">
            <div className="flex items-start">
              <Code className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-left">
                <h3 className="font-semibold text-blue-900 mb-2">How to Add Components:</h3>
                <ol className="text-blue-800 space-y-1 text-sm">
                  <li>1. Create your component in <code className="bg-blue-100 px-1 rounded">/src/components/</code></li>
                  <li>2. Import it in this file: <code className="bg-blue-100 px-1 rounded">import YourComponent from '../components/YourComponent';</code></li>
                  <li>3. Add it to the demo sections below</li>
                  <li>4. Test and iterate with hot reload!</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 inline-flex">
            <button
              onClick={() => setActiveDemo('cards')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                activeDemo === 'cards'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Cards Demo
            </button>
            <button
              onClick={() => setActiveDemo('buttons')}
              className={`px-6 py-2 rounded-md transition-colors duration-200 ${
                activeDemo === 'buttons'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Buttons Demo
            </button>
          </div>
        </div>

        {/* Component Demos */}
        <div className="space-y-8">
          {/* Cards Demo Section */}
          {activeDemo === 'cards' && (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Play className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Sample Cards</h2>
              </div>
              <p className="text-gray-600 mb-8">
                These are sample card components demonstrating different layouts and interactions.
              </p>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SampleCard
                  title="Welcome Card"
                  description="This is a sample card component with hover effects and clean styling."
                  variant="primary"
                />
                <SampleCard
                  title="Feature Card"
                  description="Another card variant showcasing different styling options and content layouts."
                  variant="secondary"
                />
                <SampleCard
                  title="Action Card"
                  description="A card with action buttons and interactive elements for user engagement."
                  variant="accent"
                  showButton={true}
                />
              </div>
            </div>
          )}

          {/* Buttons Demo Section */}
          {activeDemo === 'buttons' && (
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <Play className="h-6 w-6 text-green-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-900">Button Showcase</h2>
              </div>
              <p className="text-gray-600 mb-8">
                A collection of button variations with different styles and states.
              </p>
              
              <ButtonShowcase />
            </div>
          )}
        </div>

        {/* Add New Component Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4">
              <Plus className="h-8 w-8 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ready to Add Your Components?
            </h3>
            <p className="text-gray-600 mb-4">
              Follow the instructions above to start building and testing your own components.
            </p>
            <div className="bg-white rounded-lg p-4 max-w-2xl mx-auto">
              <code className="text-sm text-gray-800 block">
                // Example: Create a new component<br/>
                // src/components/MyComponent.tsx<br/>
                // Then import it here and add to the demos above
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Components;