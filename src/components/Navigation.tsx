import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, User, Layout } from "lucide-react";
import TaxonomySelector from "./TaxonomySelector";
import { TaxonomyContext } from "../context/TaxonomyContext";

const Navigation: React.FC = () => {
  const location = useLocation();
  const { setTaxonomy } = React.useContext(TaxonomyContext);
  const [currentTaxonomy, setCurrentTaxonomy] = React.useState("");

  const handleTaxonomyChange = (newTaxonomy: any) => {
    setTaxonomy(newTaxonomy);
    setCurrentTaxonomy(newTaxonomy);
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: User },
    { path: "/components", label: "Components", icon: Layout },
    { path: "/taxonomy", label: "Taxonomy", icon: Layout }, // Assuming Docker is a component
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Layout className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                React Lab
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  location.pathname === path
                    ? "text-blue-600 bg-blue-50 border-b-2 border-blue-600"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </Link>
            ))}
          </div>

          <TaxonomySelector
            onSelectTaxonomy={(selectedTaxonomy) => {
              console.log("Selected Taxonomy:", selectedTaxonomy);
              handleTaxonomyChange(selectedTaxonomy);

              setTaxonomy(selectedTaxonomy);
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
