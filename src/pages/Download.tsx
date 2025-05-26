
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Search, Download as DownloadIcon, FileText, Calendar, Trash2, UploadCloud } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '@/lib/apiClient';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';

const API_BASE_URL = 'http://localhost:3001/api'; // Ensure this is correct

interface Document {
  id: string;
  title: string;
  filename: string; // Name as saved by multer
  originalname: string; // Original name of the file
  mimetype: string;
  size: number; // size in bytes
  uploadDate: string; // ISO date string
  // category?: string; // Backend doesn't have category for now
  // uploadedBy?: string; // Backend doesn't explicitly provide this in document list
  // downloadCount?: number; // Backend doesn't track this
}

const Download: React.FC = () => {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // No categories from backend yet
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  // Form state for new document
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedDocs = await apiClient<Document[]>('/documents', { token });
      setDocuments(fetchedDocs || []);
    } catch (error: any) {
      toast({ title: "Errore nel caricamento", description: error.message || "Impossibile caricare i documenti.", variant: "destructive" });
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDownload = (doc: Document) => {
    const downloadUrl = `${API_BASE_URL}/documents/${doc.id}/download`;
    // Create a temporary link to trigger the download
    const link = document.createElement('a');
    link.href = downloadUrl;
    // Add the token to the URL if needed by backend for direct downloads (or rely on session/cookies if applicable)
    // For Bearer token, this method might not work directly as headers can't be set for link clicks.
    // If direct download link needs auth, backend needs to support token in query param or another mechanism.
    // For this example, assuming the GET /download endpoint might be publicly accessible once metadata is fetched,
    // or backend handles session for direct downloads.
    // If files are served statically after an initial auth check, this is simpler.
    // If the /download endpoint itself requires Authorization header, this approach won't work.
    // An alternative would be to fetch blob with apiClient and create object URL:
    // apiClient(`/documents/${doc.id}/download`, { token, responseType: 'blob' }).then(blob => { ... });
    
    link.setAttribute('download', doc.originalname); // Use originalname for the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download avviato", description: `Scaricamento di ${doc.originalname} in corso...` });
  };

  const handleUploadDocument = async () => {
    if (!newDocFile) {
      toast({ title: "File mancante", description: "Seleziona un file da caricare.", variant: "destructive" });
      return;
    }
    if (!newDocTitle.trim()) {
      toast({ title: "Titolo mancante", description: "Inserisci un titolo per il documento.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append('documentFile', newDocFile);
    formData.append('title', newDocTitle);

    setIsLoading(true);
    try {
      await apiClient('/documents', {
        method: 'POST',
        token,
        body: formData,
        isFormData: true,
      });
      toast({ title: "Caricamento completato", description: "Il documento è stato caricato con successo." });
      fetchDocuments(); // Refresh list
      setIsUploadDialogOpen(false); // Close dialog
      setNewDocTitle(''); // Reset form
      setNewDocFile(null);
      if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    } catch (error: any) {
      toast({ title: "Errore di caricamento", description: error.message || "Impossibile caricare il documento.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteDocument = async (docId: string) => {
    if (!window.confirm("Sei sicuro di voler eliminare questo documento?")) return;
    setIsLoading(true);
    try {
      await apiClient(`/documents/${docId}`, { method: 'DELETE', token });
      toast({ title: "Documento eliminato", description: "Il documento è stato rimosso con successo." });
      fetchDocuments(); // Refresh list
    } catch (error: any) {
      toast({ title: "Errore", description: error.message || "Impossibile eliminare il documento.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // const categories = ['Moduli', 'Linee Guida', 'Regolamenti', 'Documenti Ufficiali', 'Formazione', 'Altro']; // No categories from backend yet

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.originalname.toLowerCase().includes(searchTerm.toLowerCase());
    // const matchesCategory = !selectedCategory || doc.category === selectedCategory; // No categories from backend yet
    return matchesSearch; // && matchesCategory;
  });
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

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
          
          {isAdmin() && (
             <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-scout-forest hover:bg-scout-forest/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Carica Documento
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Carica Nuovo Documento</DialogTitle>
                  <DialogDescription>
                    Seleziona un file e fornisci un titolo per il nuovo documento.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="docTitle" className="text-right">
                      Titolo
                    </Label>
                    <Input 
                      id="docTitle" 
                      value={newDocTitle} 
                      onChange={(e) => setNewDocTitle(e.target.value)} 
                      className="col-span-3" 
                      placeholder="Es. Modulo Iscrizione Evento"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="docFile" className="text-right">
                      File
                    </Label>
                    <Input 
                      id="docFile" 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => setNewDocFile(e.target.files ? e.target.files[0] : null)} 
                      className="col-span-3" 
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>Annulla</Button>
                  <Button type="submit" onClick={handleUploadDocument} disabled={isLoading} className="bg-scout-forest hover:bg-scout-forest/80">
                    {isLoading ? <UploadCloud className="w-4 h-4 mr-2 animate-pulse" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                    Carica
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca documenti per titolo o nome file..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {/* Category filter removed as backend doesn't support it yet
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-scout-forest text-white" : "border-scout-forest text-scout-forest"}
              >
                Tutti
              </Button>
              {categories.map(category => ( // categories array would need to be populated dynamically or removed
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
            */}
          </div>
        </div>
        
        {isLoading && documents.length === 0 ? ( // Show loading only if no documents are yet shown
          <div className="text-center py-12"><p className="text-lg text-scout-forest">Caricamento documenti...</p></div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun documento trovato con i criteri selezionati.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map(doc => (
              <Card key={doc.id} className="scout-card hover:shadow-lg transition-shadow flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-scout-forest mb-2" />
                    {isAdmin() && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDocument(doc.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <CardTitle className="text-lg text-scout-forest leading-tight">{doc.title}</CardTitle>
                  <CardDescription className="text-xs text-gray-500 truncate" title={doc.originalname}>
                    {doc.originalname}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 flex-grow flex flex-col justify-between">
                  <div className="text-sm text-gray-600 space-y-1 mt-1">
                    {/* <Badge variant="secondary" className="bg-scout-khaki text-scout-forest text-xs">
                      {doc.mimetype}
                    </Badge> */}
                     <div className="flex items-center text-xs">
                      <Badge variant="outline" className="mr-2">{doc.mimetype.split('/')[1] || doc.mimetype}</Badge>
                      <span>{formatFileSize(doc.size)}</span>
                    </div>
                    <div className="flex items-center text-xs">
                      <Calendar className="w-3 h-3 mr-1.5" />
                      Caricato il: {new Date(doc.uploadDate).toLocaleDateString('it-IT')}
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleDownload(doc)}
                    className="w-full bg-scout-forest hover:bg-scout-forest/90 mt-2"
                    disabled={isLoading}
                  >
                    <DownloadIcon className="w-4 h-4 mr-2" />
                    Scarica
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Download;
