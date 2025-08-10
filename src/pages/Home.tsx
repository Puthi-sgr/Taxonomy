import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Zap, Layers } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Code,
      title: 'Component Testing',
      description: 'Easily test and develop new React components in isolation',
    },
    {
      icon: Zap,
      title: 'Fast Development',
      description: 'Hot reload and instant feedback with Vite build tool',
    },
    {
      icon: Layers,
      title: 'Clean Structure',
      description: 'Well-organized project structure for scalable development',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              React Lab
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            A clean, minimal React application built with Vite and React Router. 
            Perfect for testing components and rapid prototyping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/components"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Explore Components
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map(({ icon: Icon, title, description }, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
                <Icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                {title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Quick Start
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Getting Started
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    1
                  </span>
                  Navigate to the Components page to see sample components
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    2
                  </span>
                  Add your own components to the `/src/components/\` directory
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                    3
                  </span>
                  Import and test them on the Components page
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Project Structure
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700">
                <div>src/</div>
                <div>&nbsp;&nbsp;├── components/</div>
                <div>&nbsp;&nbsp;├── pages/</div>
                <div>&nbsp;&nbsp;├── App.tsx</div>
                <div>&nbsp;&nbsp;└── main.tsx</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;