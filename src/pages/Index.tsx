
import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';
import HomePage from '@/components/HomePage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-scout-paper">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-scout-forest mx-auto mb-4"></div>
          <p className="text-scout-forest font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  return user ? <HomePage /> : <LoginForm />;
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
