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

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Helpers
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#servicios" className="text-foreground hover:text-primary transition-colors font-medium">
              Servicios
            </a>
            <a href="#como-funciona" className="text-foreground hover:text-primary transition-colors font-medium">
              Cómo funciona
            </a>
            <a href="#beneficios" className="text-foreground hover:text-primary transition-colors font-medium">
              Beneficios
            </a>
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
            <a href="#servicios" className="block py-2 text-foreground hover:text-primary transition-colors">
              Servicios
            </a>
            <a href="#como-funciona" className="block py-2 text-foreground hover:text-primary transition-colors">
              Cómo funciona
            </a>
            <a href="#beneficios" className="block py-2 text-foreground hover:text-primary transition-colors">
              Beneficios
            </a>
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
