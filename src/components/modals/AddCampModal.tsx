
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddCampModalProps {
  open: boolean;
  onClose: () => void;
}

const AddCampModal: React.FC<AddCampModalProps> = ({ open, onClose }) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [cost, setCost] = useState('');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [requirements, setRequirements] = useState<string[]>([]);
  const [newRequirement, setNewRequirement] = useState('');

  const categories = ['Campo Estivo', 'Campo Invernale', 'Weekend', 'Uscita', 'Attività Speciale'];
  const ageGroups = ['L/C (8-11)', 'E/G (12-15)', 'R/S (16-20)', 'Capi', 'Famiglie', 'Misto'];

  const addRequirement = () => {
    if (newRequirement.trim() && !requirements.includes(newRequirement.trim())) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (requirement: string) => {
    setRequirements(requirements.filter(r => r !== requirement));
  };

  const handleSubmit = () => {
    // Qui andrà la logica per salvare il campo
    console.log('Nuovo campo:', {
      title, location, description, category, ageGroup,
      maxParticipants: parseInt(maxParticipants),
      cost: parseFloat(cost),
      startDate, endDate, requirements
    });
    
    // Reset form
    setTitle('');
    setLocation('');
    setDescription('');
    setCategory('');
    setAgeGroup('');
    setMaxParticipants('');
    setCost('');
    setStartDate(undefined);
    setEndDate(undefined);
    setRequirements([]);
    setNewRequirement('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-scout-forest">🏕️ Gestisci Campo</DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo campo scout al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label htmlFor="camp-title">Titolo Campo</Label>
            <Input
              id="camp-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="es. Campo Estivo Regionale 2024"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camp-category">Categoria</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="camp-age-group">Fascia d'età</Label>
              <Select value={ageGroup} onValueChange={setAgeGroup}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona fascia d'età" />
                </SelectTrigger>
                <SelectContent>
                  {ageGroups.map(group => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="camp-location">Località</Label>
            <Input
              id="camp-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="es. Base Scout Populonia, Livorno"
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Data Inizio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "dd/MM/yyyy", { locale: it }) : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Data Fine</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "dd/MM/yyyy", { locale: it }) : "Seleziona data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="camp-participants">Max Partecipanti</Label>
              <Input
                id="camp-participants"
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(e.target.value)}
                placeholder="es. 30"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="camp-cost">Costo (€)</Label>
              <Input
                id="camp-cost"
                type="number"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="es. 150.00"
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="camp-description">Descrizione</Label>
            <Textarea
              id="camp-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione dettagliata del campo..."
              className="mt-1"
              rows={4}
            />
          </div>

          <div>
            <Label>Requisiti</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Aggiungi requisito..."
                onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
              />
              <Button onClick={addRequirement} variant="outline">
                Aggiungi
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {requirements.map(requirement => (
                <Badge
                  key={requirement}
                  variant="secondary"
                  className="bg-scout-yellow/20 text-scout-forest cursor-pointer"
                  onClick={() => removeRequirement(requirement)}
                >
                  {requirement}
                  <X className="w-3 h-3 ml-1" />
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
              disabled={!title.trim() || !location.trim() || !category || !ageGroup || !startDate || !endDate}
            >
              Salva Campo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCampModal;
