import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para hacer scroll a la sección
  const scrollToSection = (id: string) => {
  if (window.location.pathname !== "/") {
    // Redirige a home con hash si es necesario
    window.location.href = id ? `/#${id}` : "/";
    return; // el scroll se hará cuando cargue la página
  }

  if (!id) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    // Quita el hash de la URL después de hacer scroll
    window.history.replaceState(null, "", window.location.pathname);
  }

  setIsOpen(false); // Cierra menú móvil
};


  // Maneja scroll si el hash cambia
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => scrollToSection("")}
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            >
              Helpers
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("servicios")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Beneficios
            </button>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost">Iniciar sesión</Button>
            <Button variant="default">Registrarse</Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-muted"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <button
              onClick={() => scrollToSection("servicios")}
              className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="block py-2 text-foreground hover:text-primary transition-colors w-full text-left"
            >
              Beneficios
            </button>
            <div className="pt-4 space-y-2">
              <Button variant="ghost" className="w-full">
                Iniciar sesión
              </Button>
              <Button variant="default" className="w-full">
                Registrarse
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
