import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-image.jpg";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Trabajador profesional en hogar moderno" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-2xl">
          <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-primary font-semibold">🏠 Conectamos confianza</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-6 leading-tight">
            Encuentra el servicio que{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
              necesitas
            </span>{" "}
            para tu hogar
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Conectamos a personas que necesitan servicios domésticos con trabajadores 
            confiables en tu zona. Rápido, seguro y con evaluaciones verificadas.
          </p>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,000+</div>
              <div className="text-sm text-muted-foreground">Servicios completados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">4.8★</div>
              <div className="text-sm text-muted-foreground">Calificación promedio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-muted-foreground">Trabajadores activos</div>
            </div>
          </div>
          <Button size="lg" variant="hero" className="text-lg group min-w-[200px] mt-4" onClick={ () => navigate(`/services`) }>
              Ver servicios <ArrowRight className="inline-block ml-2 w-4 h-4" />
            </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
