
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'editor';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula il controllo del token salvato
    const savedUser = localStorage.getItem('scout-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulazione login (in produzione userete un vero sistema di auth)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@agesci-toscana.it' && password === 'scout2024') {
      const userData = { 
        id: '1', 
        email, 
        name: 'Capo Scout Toscana',
        role: 'admin' as const
      };
      setUser(userData);
      localStorage.setItem('scout-user', JSON.stringify(userData));
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto nell'area riservata AGESCI Toscana!",
      });
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scout-user');
    toast({
      title: "Disconnesso",
      description: "Hai effettuato il logout con successo.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
