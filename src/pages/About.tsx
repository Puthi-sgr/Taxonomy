import React from 'react';
import { Code, Zap, Users, Heart } from 'lucide-react';

const About: React.FC = () => {
  const technologies = [
    { name: 'React 18', description: 'Modern React with hooks and concurrent features' },
    { name: 'Vite', description: 'Lightning-fast build tool and dev server' },
    { name: 'TypeScript', description: 'Type-safe JavaScript for better development' },
    { name: 'React Router', description: 'Declarative routing for React applications' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Lucide React', description: 'Beautiful, customizable icons' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About React Lab
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A carefully crafted development environment for building and testing React components 
            with modern tools and best practices.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-12">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-6 mx-auto">
            <Heart className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Our Mission</h2>
          <p className="text-gray-600 text-center leading-relaxed text-lg">
            To provide developers with a clean, efficient, and enjoyable environment for 
            React component development. We believe in the power of good tooling and 
            clear organization to accelerate the development process.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Technology Stack
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {technologies.map(({ name, description }, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-600 rounded-full mr-3"></div>
                  <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
                </div>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white text-center">
            <Code className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Developer Friendly</h3>
            <p className="opacity-90">
              Clean code structure with TypeScript support and modern React patterns
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-8 text-white text-center">
            <Zap className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
            <p className="opacity-90">
              Powered by Vite for instant hot reload and blazing fast builds
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-8 text-white text-center">
            <Users className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">Scalable</h3>
            <p className="opacity-90">
              Organized structure that grows with your project and team
            </p>
          </div>
        </div>

        {/* Getting Started */}
        <div className="bg-gray-100 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Getting Started
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              This project is designed to be your playground for React development. Here's how to make the most of it:
            </p>
            <ul className="text-gray-600 space-y-2">
              <li><strong>Components Page:</strong> Use this as your testing ground for new components</li>
              <li><strong>Clean Structure:</strong> Follow the established patterns for components and pages</li>
              <li><strong>Hot Reload:</strong> See your changes instantly as you develop</li>
              <li><strong>TypeScript:</strong> Enjoy type safety and better developer experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;