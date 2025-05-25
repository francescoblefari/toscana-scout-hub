
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Download as DownloadIcon, FileText, Calendar, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

interface Document {
  id: string;
  title: string;
  description: string;
  filename: string;
  fileSize: string;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  downloadCount: number;
}

const Download: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mock data
  const [documents] = useState<Document[]>([
    {
      id: '1',
      title: 'Modulo Iscrizione Campo Estivo 2024',
      description: 'Modulo per l\'iscrizione ai campi estivi regionali',
      filename: 'modulo_campo_estivo_2024.pdf',
      fileSize: '245 KB',
      uploadDate: '2024-05-15',
      uploadedBy: 'Pattuglia Campi',
      category: 'Moduli',
      downloadCount: 156
    },
    {
      id: '2',
      title: 'Linee Guida Sicurezza Campi',
      description: 'Documento ufficiale per la sicurezza durante le attività',
      filename: 'linee_guida_sicurezza.pdf',
      fileSize: '1.2 MB',
      uploadDate: '2024-05-10',
      uploadedBy: 'Commissione Sicurezza',
      category: 'Linee Guida',
      downloadCount: 89
    },
    {
      id: '3',
      title: 'Regolamento Assemblee Regionali',
      description: 'Regolamento per lo svolgimento delle assemblee',
      filename: 'regolamento_assemblee.pdf',
      fileSize: '678 KB',
      uploadDate: '2024-05-05',
      uploadedBy: 'Segreteria Regionale',
      category: 'Regolamenti',
      downloadCount: 203
    }
  ]);

  const categories = ['Moduli', 'Linee Guida', 'Regolamenti', 'Documenti Ufficiali', 'Formazione', 'Altro'];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const isAdmin = user?.role === 'admin';

  const handleDownload = (document: Document) => {
    // In produzione, qui ci sarebbe la logica per scaricare il file
    console.log(`Downloading: ${document.filename}`);
    // Simuliamo il download
    const link = document.createElement('a');
    link.href = '#';
    link.download = document.filename;
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
              <h1 className="text-3xl font-bold text-scout-forest">📁 Download Documenti</h1>
              <p className="text-gray-600 mt-1">Documenti, moduli e linee guida AGESCI</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => navigate('/admin/download/nuovo')}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Carica Documento
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
                  placeholder="Cerca documenti..."
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

        {/* Lista Documenti */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map(document => (
            <Card key={document.id} className="scout-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-scout-forest mb-2" />
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  )}
                </div>
                <CardTitle className="text-lg text-scout-forest">{document.title}</CardTitle>
                <CardDescription>{document.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="bg-scout-yellow/20 text-scout-forest">
                    {document.category}
                  </Badge>
                  <span className="text-sm text-gray-500">{document.fileSize}</span>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(document.uploadDate).toLocaleDateString('it-IT')}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {document.uploadedBy}
                  </div>
                  <div className="flex items-center">
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    {document.downloadCount} download
                  </div>
                </div>

                <Button 
                  onClick={() => handleDownload(document)}
                  className="w-full bg-scout-forest hover:bg-scout-forest/90"
                >
                  <DownloadIcon className="w-4 h-4 mr-2" />
                  Scarica
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun documento trovato</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Download;
