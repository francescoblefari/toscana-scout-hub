
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AddPatrolModalProps {
  open: boolean;
  onClose: () => void;
}

const AddPatrolModal: React.FC<AddPatrolModalProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'regionale' | 'nazionale' | ''>('');
  const [area, setArea] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [activities, setActivities] = useState<string[]>([]);
  const [newActivity, setNewActivity] = useState('');

  const addActivity = () => {
    if (newActivity.trim() && !activities.includes(newActivity.trim())) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity('');
    }
  };

  const removeActivity = (activity: string) => {
    setActivities(activities.filter(a => a !== activity));
  };

  const handleSubmit = () => {
    // Qui andrà la logica per salvare la pattuglia
    console.log('Nuova pattuglia:', {
      name, type, area, description, 
      contacts: { responsible, phone, email, address },
      activities
    });
    
    // Reset form
    setName('');
    setType('');
    setArea('');
    setDescription('');
    setResponsible('');
    setPhone('');
    setEmail('');
    setAddress('');
    setActivities([]);
    setNewActivity('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-scout-forest">👥 Aggiungi Pattuglia</DialogTitle>
          <DialogDescription>
            Aggiungi una nuova pattuglia AGESCI al sistema
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="patrol-name">Nome Pattuglia</Label>
              <Input
                id="patrol-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="es. Pattuglia Stampa Toscana"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="patrol-type">Tipo</Label>
              <Select value={type} onValueChange={(value: 'regionale' | 'nazionale') => setType(value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleziona tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regionale">Regionale</SelectItem>
                  <SelectItem value="nazionale">Nazionale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="patrol-area">Area di competenza</Label>
            <Input
              id="patrol-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="es. Toscana, Italia"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="patrol-description">Descrizione</Label>
            <Textarea
              id="patrol-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrizione delle attività della pattuglia..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-scout-forest mb-4">Contatti</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="patrol-responsible">Responsabile</Label>
                <Input
                  id="patrol-responsible"
                  value={responsible}
                  onChange={(e) => setResponsible(e.target.value)}
                  placeholder="Nome responsabile"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="patrol-phone">Telefono</Label>
                <Input
                  id="patrol-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 333 1234567"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="patrol-email">Email</Label>
                <Input
                  id="patrol-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@agesci-toscana.it"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="patrol-address">Indirizzo</Label>
                <Input
                  id="patrol-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Via, Città"
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Attività</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Aggiungi attività..."
                onKeyPress={(e) => e.key === 'Enter' && addActivity()}
              />
              <Button onClick={addActivity} variant="outline">
                Aggiungi
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {activities.map(activity => (
                <Badge
                  key={activity}
                  variant="secondary"
                  className="bg-scout-yellow/20 text-scout-forest cursor-pointer"
                  onClick={() => removeActivity(activity)}
                >
                  {activity}
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
              disabled={!name.trim() || !type || !area.trim() || !description.trim() || !responsible.trim() || !email.trim()}
            >
              Aggiungi Pattuglia
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddPatrolModal;
