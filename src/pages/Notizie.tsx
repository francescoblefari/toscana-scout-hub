import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Calendar, User } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import AddNewsModal from '../components/modals/AddNewsModal';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  categories: string[];
  excerpt: string;
}

const Notizie: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Mock data - in produzione verrebbe da database
  const [articles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'Assemblea Regionale AGESCI Toscana 2024',
      content: 'Si terrà il prossimo weekend l\'assemblea regionale...',
      author: 'Pattuglia Stampa Toscana',
      date: '2024-05-20',
      categories: ['Assemblee', 'Eventi'],
      excerpt: 'Importante appuntamento per tutti i capi della Toscana'
    },
    {
      id: '2',
      title: 'Nuovo Campo Base Regionale a Populonia',
      content: 'È stato inaugurato il nuovo campo base regionale...',
      author: 'Pattuglia Campi',
      date: '2024-05-18',
      categories: ['Campi', 'Strutture'],
      excerpt: 'Una nuova risorsa per le attività scout in Toscana'
    }
  ]);

  const categories = ['Assemblee', 'Eventi', 'Campi', 'Strutture', 'Formazione', 'Comunicazioni'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || article.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
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
              <h1 className="text-2xl sm:text-3xl font-bold text-scout-forest">📰 Notizie AGESCI Toscana</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Tutte le ultime comunicazioni e novità</p>
            </div>
          </div>
          
          {isAdmin && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Notizia
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
                  placeholder="Cerca nelle notizie..."
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
                Tutte
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

        {/* Lista Articoli */}
        <div className="space-y-6">
          {filteredArticles.map(article => (
            <Card key={article.id} className="scout-card hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <CardTitle className="text-xl text-scout-forest hover:text-scout-forest/80 cursor-pointer">
                    {article.title}
                  </CardTitle>
                  {isAdmin && (
                    <Button variant="outline" size="sm">
                      Modifica
                    </Button>
                  )}
                </div>
                <CardDescription className="text-base">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.categories.map(category => (
                    <Badge key={category} variant="secondary" className="bg-scout-yellow/20 text-scout-forest">
                      {category}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-600 gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.date).toLocaleDateString('it-IT')}
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {article.author}
                    </div>
                  </div>
                  <Button variant="link" className="text-scout-forest p-0">
                    Leggi tutto →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessuna notizia trovata</p>
          </div>
        )}
      </main>

      <AddNewsModal 
        open={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
};

export default Notizie;
