
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
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
    className={`scout-card cursor-pointer transform hover:scale-105 transition-all duration-200 h-48 ${color} border-2 hover:border-scout-forest`}
    onClick={onClick}
  >
    <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-xl mb-2 text-scout-forest">{title}</h3>
      <p className="text-base text-gray-700 font-medium">{description}</p>
    </CardContent>
  </Card>
);

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const sections = [
    {
      title: "Notizie",
      description: "Ultime novità e comunicazioni AGESCI",
      icon: "📰",
      color: "hover:bg-blue-50 bg-blue-25",
      onClick: () => navigate("/notizie")
    },
    {
      title: "Download",
      description: "Documenti e moduli AGESCI scaricabili",
      icon: "📁",
      color: "hover:bg-green-50 bg-green-25",
      onClick: () => navigate("/download")
    },
    {
      title: "Campi Scout",
      description: "Schede e informazioni campi regionali",
      icon: "🏕️",
      color: "hover:bg-yellow-50 bg-yellow-25",
      onClick: () => navigate("/campi-scout")
    },
    {
      title: "Pattuglie",
      description: "Contatti pattuglie regionali e nazionali",
      icon: "👥",
      color: "hover:bg-purple-50 bg-purple-25",
      onClick: () => navigate("/pattuglie")
    },
    {
      title: "Contattaci",
      description: "Invia contributi e segnalazioni",
      icon: "✉️",
      color: "hover:bg-red-50 bg-red-25",
      onClick: () => navigate("/contattaci")
    },
    {
      title: "Toscana Scout",
      description: "Archivio rivista ufficiale regionale",
      icon: "📖",
      color: "hover:bg-orange-50 bg-orange-25",
      onClick: () => navigate("/toscana-scout")
    }
  ];

  return (
    <div className="min-h-screen bg-scout-paper">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-scout-forest mb-4">
            Benvenuto nell'Area Riservata
          </h2>
          <p className="text-xl text-gray-700 font-medium">
            Scegli una sezione per iniziare
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {sections.map((section, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <SectionButton {...section} />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-scout-forest/20">
            <h3 className="text-2xl font-semibold text-scout-forest mb-4">
              🌲 Buona Strada! 🌲
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              "Il metodo scout è un sistema di autoeducazione progressiva, 
              fondato sull'onore, basato sull'osservazione della natura..."
            </p>
            <p className="text-base text-gray-600 mt-3 font-medium">- Robert Baden-Powell</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
