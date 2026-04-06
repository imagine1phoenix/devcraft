import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import AiChatView from '../components/dashboard/AiChatView';
import OnboardingModal from '../components/dashboard/OnboardingModal';

export default function DashboardApp() {
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [showToast, setShowToast] = useState(false);

  const handleNextStep = () => {
    if (onboardingStep === 3) {
      // Simulate saving profile and show toast when transitioning to prompt step
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
    
    if (onboardingStep < 5) {
      setOnboardingStep(prev => prev + 1);
    }
  };

  return (
    <DashboardLayout>
      {/* Background Chat View */}
      <AiChatView />

      {/* Onboarding Modals go on top */}
      {onboardingStep <= 4 && (
        <OnboardingModal 
          currentStep={onboardingStep} 
          onNext={handleNextStep} 
        />
      )}

      {/* Success Toast */}
      {showToast && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#0d0604',
          border: '1px solid #2a1610',
          borderRadius: '8px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 2000,
          boxShadow: '0 8px 16px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
            <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: '600', letterSpacing: '0.05em' }}>✓ SUCCESS</span>
            <button style={{ background: 'transparent', border: 'none', color: '#6b5548', cursor: 'pointer' }} onClick={() => setShowToast(false)}>✕</button>
          </div>
          <span style={{ color: '#f0e6dc', fontSize: '13px', fontWeight: '500', marginTop: '4px' }}>Response submitted</span>
          <span style={{ color: '#a89080', fontSize: '11px' }}>Trading profile saved successfully</span>
        </div>
      )}
    </DashboardLayout>
  );
}
