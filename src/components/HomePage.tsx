
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Header from './Header';

interface SectionButtonProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
  color: string;
}

const SectionButton: React.FC<SectionButtonProps> = ({ title, description, icon, onClick, color }) => (
  <Card 
    className={`scout-card cursor-pointer transform hover:scale-105 transition-all duration-200 h-32 ${color}`}
    onClick={onClick}
  >
    <CardContent className="p-6 h-full flex flex-col justify-center items-center text-center">
      <div className="text-3xl mb-2">{icon}</div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </CardContent>
  </Card>
);

const HomePage: React.FC = () => {
  const sections = [
    {
      title: "Notizie",
      description: "Ultime novità e comunicazioni",
      icon: "📰",
      color: "hover:bg-blue-50",
      onClick: () => console.log("Navigating to Notizie")
    },
    {
      title: "Download",
      description: "Documenti e moduli AGESCI",
      icon: "📁",
      color: "hover:bg-green-50",
      onClick: () => console.log("Navigating to Download")
    },
    {
      title: "Campi Scout",
      description: "Schede e informazioni campi",
      icon: "🏕️",
      color: "hover:bg-yellow-50",
      onClick: () => console.log("Navigating to Campi Scout")
    },
    {
      title: "Pattuglie",
      description: "Contatti pattuglie regionali",
      icon: "👥",
      color: "hover:bg-purple-50",
      onClick: () => console.log("Navigating to Pattuglie")
    },
    {
      title: "Contattaci",
      description: "Invia contributi e segnalazioni",
      icon: "✉️",
      color: "hover:bg-red-50",
      onClick: () => console.log("Navigating to Contattaci")
    },
    {
      title: "Toscana Scout",
      description: "Archivio rivista ufficiale",
      icon: "📖",
      color: "hover:bg-orange-50",
      onClick: () => console.log("Navigating to Toscana Scout")
    }
  ];

  return (
    <div className="min-h-screen bg-scout-paper">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-scout-forest mb-2">
            Benvenuto nell'Area Riservata
          </h2>
          <p className="text-gray-600">
            Scegli una sezione per iniziare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <SectionButton {...section} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <h3 className="text-xl font-semibold text-scout-forest mb-3">
              🌲 Buona Strada! 🌲
            </h3>
            <p className="text-gray-600">
              "Il metodo scout è un sistema di autoeducazione progressiva, 
              fondato sull'onore, basato sull'osservazione della natura..."
            </p>
            <p className="text-sm text-gray-500 mt-2">- Robert Baden-Powell</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
