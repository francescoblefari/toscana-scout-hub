
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface AddNewsModalProps {
  open: boolean;
  onClose: () => void;
}

const AddNewsModal: React.FC<AddNewsModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const categories = ['Assemblee', 'Eventi', 'Campi', 'Strutture', 'Formazione', 'Comunicazioni'];

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = () => {
    // Qui andrà la logica per salvare la notizia
    console.log('Nuova notizia:', { title, excerpt, content, categories: selectedCategories });
    
    // Reset form
    setTitle('');
    setExcerpt('');
    setContent('');
    setSelectedCategories([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-scout-forest">📰 Nuova Notizia</DialogTitle>
          <DialogDescription>
            Aggiungi una nuova notizia per AGESCI Toscana
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Titolo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inserisci il titolo della notizia..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Anteprima</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Breve descrizione della notizia..."
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="content">Contenuto</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Contenuto completo della notizia..."
              className="mt-1"
              rows={6}
            />
          </div>

          <div>
            <Label>Categorie</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategories.includes(category) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    selectedCategories.includes(category) 
                      ? "bg-scout-forest hover:bg-scout-forest/90" 
                      : "hover:bg-scout-forest hover:text-white"
                  }`}
                  onClick={() => handleCategoryToggle(category)}
                >
                  {category}
                  {selectedCategories.includes(category) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-scout-forest hover:bg-scout-forest/90"
              disabled={!title.trim() || !excerpt.trim() || !content.trim()}
            >
              Pubblica Notizia
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewsModal;
