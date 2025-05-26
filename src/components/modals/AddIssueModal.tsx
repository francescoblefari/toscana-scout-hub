
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AddIssueModalProps {
  open: boolean;
  onClose: () => void;
}

const AddIssueModal: React.FC<AddIssueModalProps> = ({ open, onClose }) => {
  const [issueNumber, setIssueNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    // Qui andrà la logica per salvare il numero
    console.log('Nuovo numero Toscana Scout:', {
      issueNumber, title, description, publishDate, file
    });
    
    // Reset form
    setIssueNumber('');
    setTitle('');
    setDescription('');
    setPublishDate('');
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl text-scout-forest">📖 Carica Numero</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo numero della rivista Toscana Scout
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="issue-number">Numero</Label>
              <Input
                id="issue-number"
                value={issueNumber}
                onChange={(e) => setIssueNumber(e.target.value)}
                placeholder="es. 2024/1"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="publish-date">Data Pubblicazione</Label>
              <Input
                id="publish-date"
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="issue-title">Titolo</Label>
            <Input
              id="issue-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titolo del numero..."
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="issue-description">Descrizione</Label>
            <Textarea
              id="issue-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrizione del contenuto..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="issue-file">File PDF</Label>
            <div className="mt-1">
              <input
                id="issue-file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('issue-file')?.click()}
                className="w-full border-dashed border-2 hover:bg-scout-forest/5"
              >
                📄 {file ? file.name : 'Seleziona file PDF'}
              </Button>
            </div>
            {file && (
              <p className="text-sm text-gray-600 mt-1">
                File selezionato: {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
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
              disabled={!issueNumber.trim() || !title.trim() || !publishDate || !file}
            >
              Carica Numero
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddIssueModal;
