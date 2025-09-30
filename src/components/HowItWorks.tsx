import { Search, UserCheck, Star } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Busca el servicio",
    description: "Explora servicios en tu zona y revisa los perfiles de trabajadores con sus evaluaciones",
    number: "01",
  },
  {
    icon: UserCheck,
    title: "Conecta y contrata",
    description: "Contacta directamente con el trabajador, acuerda detalles y programa el servicio",
    number: "02",
  },
  {
    icon: Star,
    title: "Evalúa la experiencia",
    description: "Califica el servicio recibido y ayuda a la comunidad con tu opinión honesta",
    number: "03",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cómo funciona
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tres pasos simples para conectar con el profesional ideal
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector line for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary to-secondary opacity-30" />
                  )}
                  
                  <div className="relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/30">
                    {/* Number badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {step.number}
                    </div>

                    <div className="mb-6 inline-block">
                      <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
