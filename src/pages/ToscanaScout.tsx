
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Plus, Search, Calendar, Download, Eye } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import AddIssueModal from '../components/modals/AddIssueModal';

interface Issue {
  id: string;
  number: string;
  title: string;
  description: string;
  publishDate: string;
  coverImage: string;
  downloadCount: number;
  fileSize: string;
}

const ToscanaScout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [issues] = useState<Issue[]>([
    {
      id: '1',
      number: '2024/1',
      title: 'Primavera Scout',
      description: 'Numero speciale dedicato alle attività primaverili e ai campi estivi',
      publishDate: '2024-03-15',
      coverImage: '/placeholder.svg',
      downloadCount: 245,
      fileSize: '12.5 MB'
    },
    {
      id: '2',
      number: '2023/4',
      title: 'Natale in Famiglia',
      description: 'Riflessioni sul valore della famiglia e delle tradizioni natalizie scout',
      publishDate: '2023-12-10',
      coverImage: '/placeholder.svg',
      downloadCount: 189,
      fileSize: '8.9 MB'
    },
    {
      id: '3',
      number: '2023/3',
      title: 'Strada e Servizio',
      description: 'Approfondimenti sulla branca R/S e il servizio nella comunità',
      publishDate: '2023-09-20',
      coverImage: '/placeholder.svg',
      downloadCount: 167,
      fileSize: '11.2 MB'
    }
  ]);

  const filteredIssues = issues.filter(issue => 
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.number.includes(searchTerm)
  );

  const isAdmin = user?.role === 'admin';

  const handleDownload = (issue: Issue) => {
    console.log(`Downloading issue: ${issue.number}`);
    const link = window.document.createElement('a');
    link.href = '#';
    link.download = `toscana_scout_${issue.number.replace('/', '_')}.pdf`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
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
              <h1 className="text-2xl sm:text-3xl font-bold text-scout-forest">📖 Toscana Scout</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Archivio rivista ufficiale regionale</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Carica Numero
            </Button>
          )}
        </div>

        {/* Ricerca */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Cerca per numero, titolo o descrizione..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista Numeri */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredIssues.map(issue => (
            <Card key={issue.id} className="scout-card hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="w-full">
                    <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-4xl">📖</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-scout-forest mb-1">
                          Numero {issue.number}
                        </div>
                        <CardTitle className="text-lg text-scout-forest leading-tight">
                          {issue.title}
                        </CardTitle>
                      </div>
                      {isAdmin && (
                        <Button variant="outline" size="sm" className="ml-2">
                          Modifica
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <CardDescription className="text-sm">{issue.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span>{new Date(issue.publishDate).toLocaleDateString('it-IT')}</span>
                    </div>
                    <span className="text-xs">{issue.fileSize}</span>
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{issue.downloadCount} download</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Anteprima
                  </Button>
                  <Button 
                    onClick={() => handleDownload(issue)}
                    className="flex-1 bg-scout-forest hover:bg-scout-forest/90"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Scarica
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredIssues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun numero trovato</p>
          </div>
        )}

        {/* Informazioni sulla rivista */}
        <div className="mt-12">
          <Card className="scout-card">
            <CardHeader>
              <CardTitle className="text-xl text-scout-forest">📖 Informazioni sulla Rivista</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                <strong>Toscana Scout</strong> è la rivista ufficiale della regione AGESCI Toscana. 
                Pubblicata trimestralmente, raccoglie articoli, riflessioni e testimonianze 
                dalla vita scout toscana. Ogni numero approfondisce temi educativi, 
                metodologici e formativi legati allo scautismo.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <AddIssueModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default ToscanaScout;
