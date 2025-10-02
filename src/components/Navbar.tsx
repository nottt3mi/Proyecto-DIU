import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EmployerProfile from "./EmployerProfile";
import WorkerProfile from "./WorkerProfile";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const scrollToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      // Si no estamos en home, redirige a home con hash
      window.location.href = id ? `/#${id}` : "/";
      return; // Salimos, el scroll se hará cuando cargue la página
    }

    // Si estamos en home, hacemos scroll
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
  }

  setIsOpen(false); // Cierra menú móvil
};


  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => scrollToSection("")} className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
            {isAuthenticated ? (
              user?.tipo === 'empleador' ? <EmployerProfile /> : <WorkerProfile />
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Iniciar sesión</Link>
                </Button>
                <Button variant="default" asChild>
                  <Link to="/register">Registrarse</Link>
                </Button>
              </>
            )}
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
              {isAuthenticated ? (
                user?.tipo === 'empleador' ? <EmployerProfile /> : <WorkerProfile />
              ) : (
                <>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/login">Iniciar sesión</Link>
                  </Button>
                  <Button variant="default" className="w-full" asChild>
                    <Link to="/register">Registrarse</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
