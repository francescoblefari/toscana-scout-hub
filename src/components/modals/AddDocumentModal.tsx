
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";

interface AddDocumentModalProps {
  open: boolean;
  onClose: () => void;
}

const AddDocumentModal: React.FC<AddDocumentModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const categories = ['Moduli', 'Linee Guida', 'Regolamenti', 'Documenti Ufficiali', 'Formazione', 'Altro'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Qui andrà la logica per salvare il documento
    console.log('Nuovo documento:', { title, description, category, file });
    
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-scout-forest">📁 Carica Documento</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo documento al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="doc-title">Titolo</Label>
            <Input
              id="doc-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Inserisci il titolo del documento..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="doc-description">Descrizione</Label>
            <Textarea
              id="doc-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrizione del documento..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="doc-category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Seleziona una categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="doc-file">File</Label>
            <div className="mt-1">
              <input
                id="doc-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('doc-file')?.click()}
                className="w-full border-dashed border-2 hover:bg-scout-forest/5"
              >
                <Upload className="w-4 h-4 mr-2" />
                {file ? file.name : 'Seleziona file da caricare'}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                File selezionato: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-scout-forest hover:bg-scout-forest/90"
              disabled={!title.trim() || !description.trim() || !category || !file}
            >
              Carica Documento
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDocumentModal;
