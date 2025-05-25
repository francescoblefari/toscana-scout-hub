
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Send, Upload, FileText } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import { toast } from "@/hooks/use-toast";

const Contattaci: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    message: '',
    attachments: [] as File[]
  });

  const contributionTypes = [
    { value: 'news', label: 'Notizia / Articolo' },
    { value: 'event', label: 'Evento' },
    { value: 'report', label: 'Segnalazione' },
    { value: 'suggestion', label: 'Suggerimento' },
    { value: 'other', label: 'Altro' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...files].slice(0, 5) // Max 5 files
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.subject || !formData.message) {
      toast({
        title: "Errore",
        description: "Compila tutti i campi obbligatori",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulazione invio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Contributo inviato!",
      description: "Il tuo contributo è stato inviato e sarà moderato dalla redazione.",
    });

    // Reset form
    setFormData({
      type: '',
      subject: '',
      message: '',
      attachments: []
    });
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-scout-paper">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-scout-forest text-scout-forest hover:bg-scout-forest hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-scout-forest">✉️ Contattaci</h1>
            <p className="text-gray-600 mt-1">Invia il tuo contributo alla redazione</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="scout-card">
                <CardHeader>
                  <CardTitle className="text-scout-forest">Invia il tuo contributo</CardTitle>
                  <CardDescription>
                    I contenuti inviati saranno moderati dalla Pattuglia Stampa prima della pubblicazione
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="type">Tipo di contributo *</Label>
                      <Select onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona il tipo di contributo" />
                        </SelectTrigger>
                        <SelectContent>
                          {contributionTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Oggetto *</Label>
                      <Input
                        id="subject"
                        placeholder="Inserisci l'oggetto del tuo contributo"
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Messaggio *</Label>
                      <Textarea
                        id="message"
                        placeholder="Descrivi il tuo contributo in dettaglio..."
                        className="min-h-[120px]"
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Allegati (opzionale)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Trascina i file qui o{' '}
                          <label className="text-scout-forest cursor-pointer hover:underline">
                            sfoglia
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG, GIF - Max 5 file
                        </p>
                      </div>

                      {formData.attachments.length > 0 && (
                        <div className="space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-gray-500" />
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile(index)}
                              >
                                Rimuovi
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-scout-forest hover:bg-scout-forest/90"
                      disabled={isSubmitting}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {isSubmitting ? 'Invio in corso...' : 'Invia Contributo'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
              <Card className="scout-card">
                <CardHeader>
                  <CardTitle className="text-scout-forest">Come funziona</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <span className="bg-scout-forest text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                    <p>Compila il form con il tuo contributo</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-scout-forest text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                    <p>La Pattuglia Stampa lo esamina</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-scout-forest text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                    <p>Se approvato, viene pubblicato</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="scout-card">
                <CardHeader>
                  <CardTitle className="text-scout-forest">Contatti Diretti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold">Pattuglia Stampa Toscana</p>
                    <p>stampa@agesci-toscana.it</p>
                    <p>+39 333 1234567</p>
                  </div>
                  <div>
                    <p className="font-semibold">Segreteria Regionale</p>
                    <p>segreteria@agesci-toscana.it</p>
                    <p>+39 333 7654321</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="scout-card">
                <CardHeader>
                  <CardTitle className="text-scout-forest">Suggerimenti</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <p>• Sii specifico nell'oggetto</p>
                  <p>• Includi dettagli rilevanti</p>
                  <p>• Allega foto se pertinenti</p>
                  <p>• Verifica l'ortografia</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contattaci;
