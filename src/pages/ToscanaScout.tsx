
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Download, Calendar, Eye, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

interface Magazine {
  id: string;
  title: string;
  issueNumber: number;
  year: number;
  month: string;
  description: string;
  coverImage: string;
  pdfUrl: string;
  fileSize: string;
  downloadCount: number;
  publishDate: string;
  articles: string[];
}

const ToscanaScout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Mock data
  const [magazines] = useState<Magazine[]>([
    {
      id: '1',
      title: 'Toscana Scout - Primavera 2024',
      issueNumber: 95,
      year: 2024,
      month: 'Marzo',
      description: 'Numero speciale dedicato ai campi estivi e alle novità della metodologia',
      coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      pdfUrl: '/downloads/toscana-scout-95.pdf',
      fileSize: '12.5 MB',
      downloadCount: 245,
      publishDate: '2024-03-15',
      articles: ['Campi Estivi 2024', 'Metodologia L/C', 'Route Nazionali', 'Sostenibilità']
    },
    {
      id: '2',
      title: 'Toscana Scout - Inverno 2024',
      issueNumber: 94,
      year: 2024,
      month: 'Gennaio',
      description: 'Focus sulla formazione capi e progetti regionali',
      coverImage: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300',
      pdfUrl: '/downloads/toscana-scout-94.pdf',
      fileSize: '9.8 MB',
      downloadCount: 189,
      publishDate: '2024-01-20',
      articles: ['Formazione Capi', 'Progetti Regionali', 'Interviste', 'Calendario Eventi']
    },
    {
      id: '3',
      title: 'Toscana Scout - Autunno 2023',
      issueNumber: 93,
      year: 2023,
      month: 'Ottobre',
      description: 'Speciale Assemblea Regionale e attività autunnali',
      coverImage: 'https://images.unsplash.com/photo-1509909756405-be0199881695?w=300',
      pdfUrl: '/downloads/toscana-scout-93.pdf',
      fileSize: '11.2 MB',
      downloadCount: 156,
      publishDate: '2023-10-10',
      articles: ['Assemblea Regionale', 'Attività Autunnali', 'Scout nel Mondo', 'Sostenibilità']
    }
  ]);

  const years = Array.from(new Set(magazines.map(mag => mag.year))).sort((a, b) => b - a);

  const filteredMagazines = magazines.filter(magazine => {
    const matchesSearch = magazine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         magazine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         magazine.articles.some(article => article.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesYear = !selectedYear || magazine.year === selectedYear;
    return matchesSearch && matchesYear;
  });

  const isAdmin = user?.role === 'admin';

  const handleDownload = (magazine: Magazine) => {
    // In produzione, qui ci sarebbe la logica per scaricare il PDF
    console.log(`Downloading: ${magazine.title}`);
    // Simuliamo il download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${magazine.title}.pdf`;
    link.click();
  };

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
              <h1 className="text-3xl font-bold text-scout-forest">📖 Toscana Scout</h1>
              <p className="text-gray-600 mt-1">Archivio della rivista ufficiale AGESCI Toscana</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin/toscana-scout/nuovo')}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Carica Numero
            </Button>
          )}
        </div>

        {/* Filtri e Ricerca */}
        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca per titolo, descrizione o articoli..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedYear === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedYear(null)}
                className={selectedYear === null ? "bg-scout-forest" : ""}
              >
                Tutti gli anni
              </Button>
              {years.map(year => (
                <Button
                  key={year}
                  variant={selectedYear === year ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedYear(year)}
                  className={selectedYear === year ? "bg-scout-forest" : ""}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Lista Riviste */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMagazines.map(magazine => (
            <Card key={magazine.id} className="scout-card hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={magazine.coverImage} 
                  alt={magazine.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-scout-forest text-white">
                    N° {magazine.issueNumber}
                  </Badge>
                </div>
                {isAdmin && (
                  <div className="absolute top-2 left-2">
                    <Button variant="outline" size="sm" className="bg-white/90">
                      Modifica
                    </Button>
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-lg text-scout-forest">{magazine.title}</CardTitle>
                <CardDescription>{magazine.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {magazine.month} {magazine.year}
                  </div>
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-1" />
                    {magazine.fileSize}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-scout-forest mb-2 text-sm">Articoli principali:</h4>
                  <div className="space-y-1">
                    {magazine.articles.slice(0, 3).map(article => (
                      <div key={article} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1 h-1 bg-scout-forest rounded-full mr-2"></span>
                        {article}
                      </div>
                    ))}
                    {magazine.articles.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{magazine.articles.length - 3} altri articoli
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-500 flex items-center justify-between">
                  <div className="flex items-center">
                    <Download className="w-4 h-4 mr-1" />
                    {magazine.downloadCount} download
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    Anteprima
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
                    onClick={() => handleDownload(magazine)}
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

        {filteredMagazines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun numero trovato</p>
          </div>
        )}

        {/* Informazioni sulla rivista */}
        <div className="mt-12">
          <Card className="scout-card">
            <CardHeader>
              <CardTitle className="text-scout-forest">📖 Informazioni sulla Rivista</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm max-w-none">
              <p className="text-gray-700">
                <strong>Toscana Scout</strong> è la rivista ufficiale dell'AGESCI Toscana, pubblicata 
                trimestralmente per informare e coinvolgere tutti i capi scout della regione. 
              </p>
              <p className="text-gray-700 mt-3">
                Ogni numero contiene articoli su metodologia, eventi regionali, formazione, 
                esperienze di gruppi e molto altro. La rivista è realizzata dalla Pattuglia Stampa 
                Toscana con il contributo di capi e ragazzi di tutta la regione.
              </p>
              <div className="mt-4 text-sm text-gray-600">
                <p><strong>Vuoi contribuire?</strong> Invia i tuoi articoli e foto alla Pattuglia Stampa!</p>
                <p>Email: <a href="mailto:stampa@agesci-toscana.it" className="text-scout-forest">stampa@agesci-toscana.it</a></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ToscanaScout;
