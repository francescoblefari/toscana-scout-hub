
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import apiClient from '@/lib/apiClient'; // Import apiClient

interface User {
  id: string;
  email: string;
  // name: string; // Backend user object might not have 'name' directly, adjust as per your API
  role: 'admin' | 'editor' | 'user'; // Add 'user' if your backend supports it
}

interface AuthContextType {
  user: User | null;
  token: string | null; // Add token state
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: () => boolean; // Helper for admin checks
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
  const [token, setToken] = useState<string | null>(null); // State for token
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('scout-user');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await apiClient<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      
      if (response.token && response.user) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('scout-user', JSON.stringify(response.user));
        localStorage.setItem('authToken', response.token);
        toast({
          title: "Accesso effettuato",
          description: `Benvenuto ${response.user.email}!`, // Use email or another identifier
        });
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false; // Should not happen if API call is structured well
    } catch (error: any) {
      console.error("Login failed:", error);
      toast({
        title: "Errore di accesso",
        description: error.message || "Credenziali non valide o errore del server.",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('scout-user');
    localStorage.removeItem('authToken');
    toast({
      title: "Disconnesso",
      description: "Hai effettuato il logout con successo.",
    });
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
