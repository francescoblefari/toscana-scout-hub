import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Phone, Mail, User, MapPin } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import AddPatrolModal from '../components/modals/AddPatrolModal';

interface Patrol {
  id: string;
  name: string;
  type: 'regionale' | 'nazionale';
  area: string;
  description: string;
  contacts: {
    responsible: string;
    phone: string;
    email: string;
    address: string;
  };
  activities: string[];
  addedBy: string;
  addedDate: string;
}

const Pattuglie: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data
  const [patrols] = useState<Patrol[]>([
    {
      id: '1',
      name: 'Pattuglia Stampa Toscana',
      type: 'regionale',
      area: 'Toscana',
      description: 'Gestione comunicazione e pubblicazioni regionali',
      contacts: {
        responsible: 'Elena Verdi',
        phone: '+39 333 1234567',
        email: 'stampa@agesci-toscana.it',
        address: 'Via Scout 12, Firenze'
      },
      activities: ['Comunicazione', 'Newsletter', 'Sito Web', 'Social Media'],
      addedBy: 'Segreteria Regionale',
      addedDate: '2024-01-15'
    },
    {
      id: '2',
      name: 'Pattuglia Campi Toscana',
      type: 'regionale',
      area: 'Toscana',
      description: 'Gestione e manutenzione campi e basi scout regionali',
      contacts: {
        responsible: 'Marco Blu',
        phone: '+39 347 9876543',
        email: 'campi@agesci-toscana.it',
        address: 'Via Natura 45, Pisa'
      },
      activities: ['Manutenzione Campi', 'Sicurezza', 'Logistica', 'Attrezzature'],
      addedBy: 'Consiglio Regionale',
      addedDate: '2024-01-10'
    },
    {
      id: '3',
      name: 'Pattuglia Nazionale Formazione Capi',
      type: 'nazionale',
      area: 'Italia',
      description: 'Coordinamento formazione capi livello nazionale',
      contacts: {
        responsible: 'Anna Gialli',
        phone: '+39 333 5555555',
        email: 'formazione@agesci.it',
        address: 'Via Nazionale 100, Roma'
      },
      activities: ['Formazione', 'Metodologia', 'Coordinamento', 'Eventi Nazionali'],
      addedBy: 'Consiglio Generale',
      addedDate: '2024-01-01'
    }
  ]);

  const filteredPatrols = patrols.filter(patrol => {
    const matchesSearch = patrol.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patrol.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patrol.area.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || patrol.type === selectedType;
    return matchesSearch && matchesType;
  });

  const isAdmin = user?.role === 'admin';

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
              <h1 className="text-2xl sm:text-3xl font-bold text-scout-forest">👥 Pattuglie AGESCI</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Contatti pattuglie regionali e nazionali</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Aggiungi Pattuglia
            </Button>
          )}
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca pattuglie..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(null)}
                className={selectedType === null ? "bg-scout-forest" : ""}
              >
                Tutte
              </Button>
              <Button
                variant={selectedType === 'regionale' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('regionale')}
                className={selectedType === 'regionale' ? "bg-scout-forest" : ""}
              >
                Regionali
              </Button>
              <Button
                variant={selectedType === 'nazionale' ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType('nazionale')}
                className={selectedType === 'nazionale' ? "bg-scout-forest" : ""}
              >
                Nazionali
              </Button>
            </div>
          </div>
        </div>

        {/* Lista Pattuglie */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPatrols.map(patrol => (
            <Card key={patrol.id} className="scout-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl text-scout-forest">{patrol.name}</CardTitle>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patrol.type === 'regionale' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {patrol.type.charAt(0).toUpperCase() + patrol.type.slice(1)}
                      </span>
                      <span className="text-sm text-gray-600">{patrol.area}</span>
                    </div>
                  </div>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  )}
                </div>
                <CardDescription className="text-base">{patrol.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <h4 className="font-semibold text-scout-forest">Contatti</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-500" />
                      <span className="font-medium">{patrol.contacts.responsible}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`tel:${patrol.contacts.phone}`} className="text-scout-forest hover:underline">
                        {patrol.contacts.phone}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-500" />
                      <a href={`mailto:${patrol.contacts.email}`} className="text-scout-forest hover:underline">
                        {patrol.contacts.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{patrol.contacts.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-scout-forest mb-2">Attività</h4>
                  <div className="flex flex-wrap gap-1">
                    {patrol.activities.map(activity => (
                      <span 
                        key={activity}
                        className="px-2 py-1 bg-scout-yellow/20 text-scout-forest text-xs rounded-full"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
                    asChild
                  >
                    <a href={`tel:${patrol.contacts.phone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Chiama
                    </a>
                  </Button>
                  <Button 
                    className="flex-1 bg-scout-forest hover:bg-scout-forest/90"
                    asChild
                  >
                    <a href={`mailto:${patrol.contacts.email}`}>
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPatrols.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessuna pattuglia trovata</p>
          </div>
        )}
      </main>

      <AddPatrolModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default Pattuglie;
