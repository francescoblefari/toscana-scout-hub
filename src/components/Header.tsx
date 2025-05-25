
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-scout-forest text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🏕️</span>
          <div>
            <h1 className="text-xl font-bold">AGESCI Toscana</h1>
            <p className="text-sm text-green-200">Area Riservata Capi Scout</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Ciao, {user?.name}</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="border-white text-white hover:bg-white hover:text-scout-forest"
          >
            Esci
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
