import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Únete a nuestra comunidad de miles de personas que confían en 
            ServiciosLocal para sus necesidades del hogar
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="hero" className="text-lg group min-w-[200px]">
              Empezar ahora
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg min-w-[200px]">
              Más información
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 pt-12 border-t grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted-foreground">Seguro</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">24/7</div>
              <div className="text-sm text-muted-foreground">Soporte</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">Verificado</div>
              <div className="text-sm text-muted-foreground">Trabajadores</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">Gratis</div>
              <div className="text-sm text-muted-foreground">Registro</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
