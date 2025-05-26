
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, MapPin, Phone, Mail, Users, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';

interface ScoutCamp {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  province: string;
  contact: {
    phone: string;
    email: string;
    responsible: string;
  };
  capacity: number;
  services: string[];
  status: 'approved' | 'pending' | 'rejected';
  images: string[]; // Assuming backend provides array of image URLs or paths
  addedBy?: string; // Optional, backend might not provide this for all camps
  addedDate?: string; // Optional
}

const CampiScout: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [camps, setCamps] = useState<ScoutCamp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCamps, setShowAllCamps] = useState(false); // For admin to toggle view

  const provinces = ['AR', 'FI', 'GR', 'LI', 'LU', 'MS', 'PI', 'PO', 'PT', 'SI'];

  const fetchCamps = useCallback(async () => {
    setIsLoading(true);
    try {
      const endpoint = isAdmin() && showAllCamps ? '/camps/all' : '/camps';
      const fetchedCamps = await apiClient<ScoutCamp[]>(endpoint, { token });
      setCamps(fetchedCamps || []); // Ensure camps is always an array
    } catch (error: any) {
      toast({ title: "Errore nel caricamento", description: error.message || "Impossibile caricare i campi.", variant: "destructive" });
      setCamps([]); // Set to empty array on error
    } finally {
      setIsLoading(false);
    }
  }, [token, isAdmin, showAllCamps]);

  useEffect(() => {
    fetchCamps();
  }, [fetchCamps]);

  const handleCampProposal = () => {
    // This would navigate to a form, for now, we'll assume it's a separate page/modal
    // For simplicity, a real implementation would involve a form and then a POST request
    // Example: POST /camps with new camp data
    navigate('/campi-scout/nuovo'); // Assuming a route for new camp form
  };

  const handleEditCamp = (campId: string) => {
    navigate(`/admin/campi-scout/modifica/${campId}`); // Navigate to an edit form
  };

  const handleDeleteCamp = async (campId: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo campo?")) return;
    try {
      await apiClient(`/camps/${campId}`, { method: 'DELETE', token });
      toast({ title: "Campo eliminato", description: "Il campo è stato rimosso con successo." });
      fetchCamps(); // Refresh list
    } catch (error: any) {
      toast({ title: "Errore", description: error.message || "Impossibile eliminare il campo.", variant: "destructive" });
    }
  };

  const handleApproveCamp = async (campId: string) => {
    try {
      await apiClient(`/camps/${campId}/approve`, { method: 'PUT', token });
      toast({ title: "Campo approvato", description: "Il campo è ora visibile pubblicamente." });
      fetchCamps(); // Refresh list
    } catch (error: any) {
      toast({ title: "Errore", description: error.message || "Impossibile approvare il campo.", variant: "destructive" });
    }
  };
  
  const handleRejectCamp = async (campId: string) => {
    try {
      await apiClient(`/camps/${campId}/reject`, { method: 'PUT', token });
      toast({ title: "Campo rifiutato", description: "Il campo è stato marcato come rifiutato." });
      fetchCamps(); // Refresh list
    } catch (error: any) {
      toast({ title: "Errore", description: error.message || "Impossibile rifiutare il campo.", variant: "destructive" });
    }
  };


  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (camp.description && camp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesProvince = !selectedProvince || camp.province === selectedProvince;
    
    if (isAdmin() && showAllCamps) { // Admin viewing all camps can see any status
        return matchesSearch && matchesProvince;
    }
    return matchesSearch && matchesProvince && camp.status === 'approved'; // Default view
  });

  return (
    <div className="min-h-screen bg-scout-paper">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Home
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-scout-forest">🏕️ Campi Scout Toscana</h1>
              <p className="text-gray-600 mt-1">Trova il campo perfetto per le tue attività</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              onClick={handleCampProposal}
              variant="outline"
              className="border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Proponi Campo
            </Button>
            {isAdmin() && (
              <Button 
                onClick={() => setShowAllCamps(!showAllCamps)}
                className="bg-scout-forest hover:bg-scout-forest/90 text-white"
              >
                {showAllCamps ? 'Mostra Approvati' : 'Gestisci Tutti'}
              </Button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca campi per nome, città o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedProvince === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedProvince(null)}
                className={selectedProvince === null ? "bg-scout-forest text-white" : "border-scout-forest text-scout-forest"}
              >
                Tutte le Province
              </Button>
              {provinces.map(province => (
                <Button
                  key={province}
                  variant={selectedProvince === province ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvince(province)}
                  className={selectedProvince === province ? "bg-scout-forest text-white" : "border-scout-forest text-scout-forest"}
                >
                  {province}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12"><p className="text-lg text-scout-forest">Caricamento campi...</p></div>
        ) : filteredCamps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun campo trovato con i criteri selezionati.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredCamps.map(camp => (
              <Card key={camp.id} className={`scout-card hover:shadow-lg transition-shadow border-2 ${
                camp.status === 'pending' ? 'border-yellow-400' : 
                camp.status === 'rejected' ? 'border-red-400' : 'border-transparent'
              }`}>
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img 
                    src={camp.images && camp.images.length > 0 ? camp.images[0] : 'https://via.placeholder.com/400x225?text=Campo+Scout'} 
                    alt={camp.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 flex space-x-1">
                    {isAdmin() && showAllCamps && (
                      <Badge className={
                        camp.status === 'approved' ? 'bg-green-500' :
                        camp.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }>
                        {camp.status}
                      </Badge>
                    )}
                    <Badge className="bg-scout-forest text-white">{camp.province}</Badge>
                  </div>
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-scout-forest">{camp.name}</CardTitle>
                    {isAdmin() && (
                      <div className="flex space-x-1">
                        <Button variant="outline" size="icon" onClick={() => handleEditCamp(camp.id)} className="text-scout-orange border-scout-orange hover:bg-scout-orange hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteCamp(camp.id)} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-base">{camp.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-scout-forest" />
                      {camp.address}, {camp.city} ({camp.province})
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-scout-forest" />
                      Capacità: {camp.capacity} persone
                    </div>
                    {camp.contact && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2 text-scout-forest" />
                          {camp.contact.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-4 h-4 mr-2 text-scout-forest" />
                          {camp.contact.email}
                        </div>
                      </>
                    )}
                  </div>

                  {camp.services && camp.services.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-scout-forest mb-2">Servizi disponibili:</h4>
                      <div className="flex flex-wrap gap-1">
                        {camp.services.map(service => (
                          <Badge key={service} variant="secondary" className="text-xs bg-scout-khaki text-scout-forest">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isAdmin() && showAllCamps && camp.status !== 'approved' && (
                    <div className="flex space-x-2 pt-2">
                      {camp.status === 'pending' && (
                        <Button onClick={() => handleApproveCamp(camp.id)} size="sm" className="bg-green-500 hover:bg-green-600 text-white">
                          <CheckCircle className="w-4 h-4 mr-1" /> Approva
                        </Button>
                      )}
                      {camp.status !== 'rejected' && (
                         <Button onClick={() => handleRejectCamp(camp.id)} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                           <XCircle className="w-4 h-4 mr-1" /> Rifiuta
                         </Button>
                      )}
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
                      onClick={() => navigate(`/campi-scout/${camp.id}`)} // Assuming a detail page route
                    >
                      Vedi Dettagli
                    </Button>
                    <Button 
                      className="flex-1 bg-scout-forest hover:bg-scout-forest/90"
                      onClick={() => window.location.href = `mailto:${camp.contact?.email || ''}`}
                    >
                      Contatta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CampiScout;
