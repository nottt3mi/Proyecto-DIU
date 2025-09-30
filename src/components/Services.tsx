import { Card, CardContent } from "@/components/ui/card";
import serviceGardening from "@/assets/service-gardening.jpg";
import serviceRepairs from "@/assets/service-repairs.jpg";
import serviceCleaning from "@/assets/service-cleaning.jpg";
import { Leaf, Wrench, Sparkles, Paintbrush, Package, Settings } from "lucide-react";

const services = [
  {
    title: "Jardinería",
    description: "Corte de pasto, poda, diseño de jardines y mantenimiento de áreas verdes",
    image: serviceGardening,
    icon: Leaf,
    color: "text-secondary",
  },
  {
    title: "Reparaciones",
    description: "Plomería, electricidad, carpintería y reparaciones generales del hogar",
    image: serviceRepairs,
    icon: Wrench,
    color: "text-primary",
  },
  {
    title: "Limpieza",
    description: "Limpieza profunda, mantenimiento regular y organización del hogar",
    image: serviceCleaning,
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

const Services = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Servicios disponibles
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Encuentra el profesional ideal para cualquier tarea del hogar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50"
              >
                <CardContent className="p-6">
                  {service.image && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
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
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
