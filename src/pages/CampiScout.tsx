
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Calendar, MapPin, Users, Euro } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import AddCampModal from '../components/modals/AddCampModal';

interface Camp {
  id: string;
  title: string;
  location: string;
  description: string;
  startDate: string;
  endDate: string;
  category: string;
  ageGroup: string;
  maxParticipants: number;
  currentParticipants: number;
  cost: number;
  status: 'open' | 'full' | 'closed';
  requirements: string[];
}

const CampiScout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [camps] = useState<Camp[]>([
    {
      id: '1',
      title: 'Campo Estivo Regionale 2024',
      location: 'Base Scout Populonia, Livorno',
      description: 'Campo estivo per la branca E/G con attività di mare e natura',
      startDate: '2024-07-15',
      endDate: '2024-07-22',
      category: 'Campo Estivo',
      ageGroup: 'E/G (12-15)',
      maxParticipants: 30,
      currentParticipants: 25,
      cost: 180,
      status: 'open',
      requirements: ['Saper nuotare', 'Autorizzazione medica']
    },
    {
      id: '2',
      title: 'Weekend di Formazione Capi',
      location: 'Casa Scout Vicopelago, Lucca',
      description: 'Weekend formativo per nuovi capi della regione',
      startDate: '2024-06-08',
      endDate: '2024-06-09',
      category: 'Weekend',
      ageGroup: 'Capi',
      maxParticipants: 20,
      currentParticipants: 20,
      cost: 45,
      status: 'full',
      requirements: ['Essere capi in servizio']
    }
  ]);

  const categories = ['Campo Estivo', 'Campo Invernale', 'Weekend', 'Uscita', 'Attività Speciale'];

  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || camp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAdmin = user?.role === 'admin';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-orange-100 text-orange-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Aperto';
      case 'full': return 'Completo';
      case 'closed': return 'Chiuso';
      default: return 'Sconosciuto';
    }
  };

  return (
    <div className="min-h-screen bg-scout-paper">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
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
              <h1 className="text-2xl sm:text-3xl font-bold text-scout-forest">🏕️ Campi Scout</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Campi e attività AGESCI Toscana</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Gestisci Campo
            </Button>
          )}
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca campi..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-scout-forest" : ""}
              >
                Tutti
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-scout-forest" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista Campi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCamps.map(camp => (
            <Card key={camp.id} className="scout-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl text-scout-forest">{camp.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="secondary" className="bg-scout-yellow/20 text-scout-forest">
                        {camp.category}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {camp.ageGroup}
                      </Badge>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(camp.status)}`}>
                        {getStatusText(camp.status)}
                      </span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  )}
                </div>
                <CardDescription className="text-base">{camp.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>
                      {new Date(camp.startDate).toLocaleDateString('it-IT')} - {new Date(camp.endDate).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="truncate">{camp.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{camp.currentParticipants}/{camp.maxParticipants} partecipanti</span>
                  </div>
                  <div className="flex items-center">
                    <Euro className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{camp.cost}€</span>
                  </div>
                </div>

                {camp.requirements.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-scout-forest mb-2 text-sm">Requisiti:</h4>
                    <div className="flex flex-wrap gap-1">
                      {camp.requirements.map(req => (
                        <span 
                          key={req}
                          className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
                  >
                    Dettagli
                  </Button>
                  <Button 
                    className="flex-1 bg-scout-forest hover:bg-scout-forest/90"
                    disabled={camp.status !== 'open'}
                  >
                    {camp.status === 'open' ? 'Iscriviti' : camp.status === 'full' ? 'Completo' : 'Chiuso'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCamps.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun campo trovato</p>
          </div>
        )}
      </main>

      <AddCampModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default CampiScout;
