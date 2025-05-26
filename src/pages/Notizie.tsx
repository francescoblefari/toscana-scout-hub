
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Calendar, User, Edit, Trash2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';

interface NewsArticle {
  id: string;
  title: string;
  content: string; // Full content for detail view, not always shown in list
  author: string;
  date: string; // ISO date string
  categories: string[];
  excerpt?: string; // Optional short summary
}

const Notizie: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allCategories, setAllCategories] = useState<string[]>([]);


  const fetchNews = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await apiClient<NewsArticle[]>('/news', { token });
      setArticles(fetchedArticles || []);
      // Extract all unique categories from fetched articles
      const uniqueCategories = new Set<string>();
      (fetchedArticles || []).forEach(article => {
        article.categories.forEach(cat => uniqueCategories.add(cat));
      });
      setAllCategories(Array.from(uniqueCategories));
    } catch (error: any) {
      toast({ title: "Errore nel caricamento", description: error.message || "Impossibile caricare le notizie.", variant: "destructive" });
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleCreateNews = () => {
    navigate('/admin/notizie/nuova'); // Navigate to a form for creating news
  };

  const handleEditNews = (articleId: string) => {
    navigate(`/admin/notizie/modifica/${articleId}`); // Navigate to an edit form
  };

  const handleDeleteNews = async (articleId: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questa notizia?")) return;
    try {
      await apiClient(`/news/${articleId}`, { method: 'DELETE', token });
      toast({ title: "Notizia eliminata", description: "L'articolo è stato rimosso con successo." });
      fetchNews(); // Refresh list
    } catch (error: any) {
      toast({ title: "Errore", description: error.message || "Impossibile eliminare la notizia.", variant: "destructive" });
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (article.excerpt && article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || (article.categories && article.categories.includes(selectedCategory));
    return matchesSearch && matchesCategory;
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
              <h1 className="text-3xl font-bold text-scout-forest">📰 Notizie AGESCI Toscana</h1>
              <p className="text-gray-600 mt-1">Tutte le ultime comunicazioni e novità</p>
            </div>
          </div>
          
          {isAdmin() && (
            <Button 
              onClick={handleCreateNews}
              className="bg-scout-forest hover:bg-scout-forest/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuova Notizia
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
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
                className={selectedCategory === null ? "bg-scout-forest text-white" : "border-scout-forest text-scout-forest"}
              >
                Tutte
              </Button>
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-scout-forest text-white" : "border-scout-forest text-scout-forest"}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12"><p className="text-lg text-scout-forest">Caricamento notizie...</p></div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessuna notizia trovata con i criteri selezionati.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredArticles.map(article => (
              <Card key={article.id} className="scout-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle 
                      className="text-xl text-scout-forest hover:text-scout-forest/80 cursor-pointer"
                      onClick={() => navigate(`/notizie/${article.id}`)} // Navigate to detail page
                    >
                      {article.title}
                    </CardTitle>
                    {isAdmin() && (
                       <div className="flex space-x-1">
                        <Button variant="outline" size="icon" onClick={() => handleEditNews(article.id)} className="text-scout-orange border-scout-orange hover:bg-scout-orange hover:text-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDeleteNews(article.id)} className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-base">{article.excerpt || article.content.substring(0, 150) + '...'}</CardDescription>
                </CardHeader>
                <CardContent>
                  {article.categories && article.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.categories.map(category => (
                        <Badge key={category} variant="secondary" className="bg-scout-khaki text-scout-forest">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-scout-forest" />
                        {new Date(article.date).toLocaleDateString('it-IT')}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1 text-scout-forest" />
                        {article.author}
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      className="text-scout-forest p-0 hover:text-scout-orange"
                      onClick={() => navigate(`/notizie/${article.id}`)} // Navigate to detail page
                    >
                      Leggi tutto →
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

export default Notizie;
