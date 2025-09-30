import { Card, CardContent } from "@/components/ui/card";
import { Shield, MapPin, Clock, ThumbsUp, Users, DollarSign } from "lucide-react";

const employerBenefits = [
  {
    icon: Shield,
    title: "Trabajadores verificados",
    description: "Todos los perfiles incluyen evaluaciones reales de otros usuarios",
  },
  {
    icon: MapPin,
    title: "Cerca de ti",
    description: "Encuentra servicios en tu zona para mayor comodidad",
  },
  {
    icon: Clock,
    title: "Rápido y fácil",
    description: "Contrata en minutos sin complicaciones",
  },
];

const workerBenefits = [
  {
    icon: ThumbsUp,
    title: "Construye tu reputación",
    description: "Las buenas evaluaciones atraen más clientes y potencian tu negocio",
  },
  {
    icon: Users,
    title: "Más oportunidades",
    description: "Accede a una red amplia de clientes potenciales",
  },
  {
    icon: DollarSign,
    title: "Trabaja a tu ritmo",
    description: "Elige cuándo y dónde ofrecer tus servicios",
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Beneficios para todos
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Una plataforma diseñada tanto para empleadores como para trabajadores
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* For Employers */}
          <div>
            <div className="mb-8">
              <div className="inline-block px-6 py-3 bg-primary/10 rounded-full mb-4">
                <span className="text-primary font-semibold text-lg">Para Empleadores</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">
                Contrata con confianza
              </h3>
              <p className="text-muted-foreground text-lg">
                Encuentra el profesional perfecto para tu hogar
              </p>
            </div>

            <div className="space-y-4">
              {employerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-all">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* For Workers */}
          <div>
            <div className="mb-8">
              <div className="inline-block px-6 py-3 bg-secondary/10 rounded-full mb-4">
                <span className="text-secondary font-semibold text-lg">Para Trabajadores</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">
                Crece tu negocio
              </h3>
              <p className="text-muted-foreground text-lg">
                Conecta con clientes que necesitan tus servicios
              </p>
            </div>

            <div className="space-y-4">
              {workerBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="border-2 hover:border-secondary/50 transition-all">
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-secondary/10 rounded-lg">
                          <Icon className="w-6 h-6 text-secondary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                        <p className="text-muted-foreground">{benefit.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
