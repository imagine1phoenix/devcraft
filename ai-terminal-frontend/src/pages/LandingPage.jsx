import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import WorkflowSection from '../components/WorkflowSection';
import BeastSection from '../components/BeastSection';
import FeaturesSection from '../components/FeaturesSection';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="app">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <BeastSection />
      <FeaturesSection />
      <FinalCTA />
      <Footer />
    </div>
  );
}
