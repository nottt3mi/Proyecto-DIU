import { useState } from "react";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Leaf, Wrench, Sparkles, Paintbrush, Package, Settings, Search } from "lucide-react";

const services = [
  {
    title: "Jardinería",
    description: "Corte de pasto, poda, diseño de jardines y mantenimiento de áreas verdes",
    icon: Leaf,
    color: "text-secondary",
  },
  {
    title: "Reparaciones",
    description: "Plomería, electricidad, carpintería y reparaciones generales del hogar",
    icon: Wrench,
    color: "text-primary",
  },
  {
    title: "Limpieza",
    description: "Limpieza profunda, mantenimiento regular y organización del hogar",
    icon: Sparkles,
    color: "text-secondary-glow",
  },
  {
    title: "Pintura",
    description: "Pintura interior y exterior, renovación de espacios",
    icon: Paintbrush,
    color: "text-primary",
  },
  {
    title: "Mudanzas",
    description: "Empaque, transporte y organización para tu mudanza",
    icon: Package,
    color: "text-secondary",
  },
  {
    title: "Mantenimiento",
    description: "Servicios generales de mantenimiento preventivo y correctivo",
    icon: Settings,
    color: "text-primary",
  },
];

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <div className="container mx-auto px-4 mt-10 mb-10">
                <div className="text-center mb-10">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4">
                    Servicios disponibles
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Encuentra el profesional ideal para cualquier tarea del hogar
                  </p>
                </div>

                <div className="max-w-md mx-auto mb-8">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Buscar servicios por nombre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
        
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service, index) => {
                    const Icon = service.icon;
                    return (
                      <Card 
                        key={index} 
                        className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`${service.color} p-3 bg-muted rounded-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                {service.title}
                              </h3>
                              <p className="text-muted-foreground">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground text-lg">
                        No se encontraron servicios que coincidan con "{searchTerm}"
                      </p>
                    </div>
                  )}
                </div>
              </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
