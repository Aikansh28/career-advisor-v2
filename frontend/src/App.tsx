import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from './contexts/UserContext';
import { LandingPage } from './components/LandingPage';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { UserDashboard } from './components/UserDashboard';
import { CareerAssessment } from './components/CareerAssessment';
import { CareerRecommendations } from './components/CareerRecommendations';
import { CareerRoadmap } from './components/CareerRoadmap';

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <Router>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<LandingPage isLoggedIn={isLoggedIn} />} />
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
              <Route path="/user-dashboard" element={<UserDashboard onLogout={handleLogout} />} />
              <Route path="/assessment" element={<CareerAssessment />} />
              <Route path="/recommendations" element={<CareerRecommendations />} />
              <Route path="/roadmap" element={<CareerRoadmap />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TooltipProvider>
        </Router>
      </UserProvider>
    </QueryClientProvider>
  );
};

export default App;
