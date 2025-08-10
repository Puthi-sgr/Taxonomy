import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import Components from "./pages/Components";
import NotFound from "./pages/NotFound";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation component renders on all pages */}
        <Navigation />

        {/* Main content area with routing */}
        <main>
          <Routes>
            {/* Define all application routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/components" element={<Components />} />
            <Route path="/docker" element={<Components />} />

            {/* Catch-all route for 404 errors */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
