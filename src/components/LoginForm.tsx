
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Errore",
        description: "Inserisci email e password per accedere.",
        variant: "destructive",
      });
      return;
    }

    const success = await login(email, password);
    if (!success) {
      toast({
        title: "Credenziali non valide",
        description: "Verifica email e password e riprova.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-scout-forest to-scout-uniform p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-scout-yellow rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-scout-forest">🏕️</span>
          </div>
          <CardTitle className="text-2xl font-bold text-scout-forest">
            AGESCI Toscana
          </CardTitle>
          <CardDescription>
            Accedi all'area riservata per i Capi Scout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="capo@agesci-toscana.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full scout-button" 
              disabled={isLoading}
            >
              {isLoading ? 'Accesso in corso...' : 'Accedi'}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Demo: admin@agesci-toscana.it / scout2024
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
