
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, MapPin, Phone, Mail, Users, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

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
  images: string[];
  addedBy: string;
  addedDate: string;
}

const CampiScout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  // Mock data
  const [camps] = useState<ScoutCamp[]>([
    {
      id: '1',
      name: 'Campo Base Populonia',
      description: 'Campo base regionale con vista sul mare, ideale per tutte le branche',
      address: 'Via del Campo 123',
      city: 'Populonia',
      province: 'LI',
      contact: {
        phone: '+39 0565 123456',
        email: 'populonia@agesci-toscana.it',
        responsible: 'Marco Bianchi'
      },
      capacity: 120,
      services: ['Cucina', 'Bagni', 'Docce', 'Area Fuoco', 'Parcheggio', 'Acqua Potabile'],
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400'],
      addedBy: 'Pattuglia Campi',
      addedDate: '2024-05-10'
    },
    {
      id: '2',
      name: 'Casa Scout Chianti',
      description: 'Casa scout immersa nelle colline del Chianti',
      address: 'Strada del Chianti 45',
      city: 'Greve in Chianti',
      province: 'FI',
      contact: {
        phone: '+39 055 987654',
        email: 'chianti@agesci-toscana.it',
        responsible: 'Laura Rossi'
      },
      capacity: 80,
      services: ['Cucina Attrezzata', 'Camere', 'Bagni', 'Sala Attività', 'Giardino'],
      status: 'approved',
      images: ['https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=400'],
      addedBy: 'Gruppo FI 12',
      addedDate: '2024-05-05'
    }
  ]);

  const provinces = ['AR', 'FI', 'GR', 'LI', 'LU', 'MS', 'PI', 'PO', 'PT', 'SI'];

  const filteredCamps = camps.filter(camp => {
    const matchesSearch = camp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         camp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProvince = !selectedProvince || camp.province === selectedProvince;
    return matchesSearch && matchesProvince && camp.status === 'approved';
  });

  const isAdmin = user?.role === 'admin';

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
              onClick={() => navigate('/campi-scout/nuovo')}
              variant="outline"
              className="border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Proponi Campo
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin/campi-scout')}
                className="bg-scout-forest hover:bg-scout-forest/90 text-white"
              >
                Gestisci Campi
              </Button>
            )}
          </div>
        </div>

        {/* Filtri e Ricerca */}
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
                className={selectedProvince === null ? "bg-scout-forest" : ""}
              >
                Tutte le Province
              </Button>
              {provinces.map(province => (
                <Button
                  key={province}
                  variant={selectedProvince === province ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProvince(province)}
                  className={selectedProvince === province ? "bg-scout-forest" : ""}
                >
                  {province}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista Campi */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCamps.map(camp => (
            <Card key={camp.id} className="scout-card hover:shadow-lg transition-shadow">
              <div className="aspect-video relative overflow-hidden rounded-t-lg">
                <img 
                  src={camp.images[0]} 
                  alt={camp.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-scout-forest text-white">
                    {camp.province}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-scout-forest">{camp.name}</CardTitle>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  )}
                </div>
                <CardDescription className="text-base">{camp.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    {camp.address}, {camp.city} ({camp.province})
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    Capacità: {camp.capacity} persone
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {camp.contact.phone}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {camp.contact.email}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-scout-forest mb-2">Servizi disponibili:</h4>
                  <div className="flex flex-wrap gap-1">
                    {camp.services.map(service => (
                      <Badge key={service} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
                  >
                    Vedi Dettagli
                  </Button>
                  <Button 
                    className="flex-1 bg-scout-forest hover:bg-scout-forest/90"
                  >
                    Contatta
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
    </div>
  );
};

export default CampiScout;
