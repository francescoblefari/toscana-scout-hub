
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Notizie from "./pages/Notizie";
import Download from "./pages/Download";
import CampiScout from "./pages/CampiScout";
import Pattuglie from "./pages/Pattuglie";
import Contattaci from "./pages/Contattaci";
import ToscanaScout from "./pages/ToscanaScout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/notizie" element={<Notizie />} />
          <Route path="/download" element={<Download />} />
          <Route path="/campi-scout" element={<CampiScout />} />
          <Route path="/pattuglie" element={<Pattuglie />} />
          <Route path="/contattaci" element={<Contattaci />} />
          <Route path="/toscana-scout" element={<ToscanaScout />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
