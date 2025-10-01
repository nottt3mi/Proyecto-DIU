import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Building2, User } from "lucide-react";
import { Link } from "react-router-dom";

const LoginType = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
          <h1 className="text-4xl font-bold text-center mb-4">Iniciar Sesión</h1>
          <p className="text-xl text-muted-foreground text-center max-w-2xl mx-auto">
            Selecciona el tipo de cuenta para acceder
          </p>
        </div>

        {/* Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Empleador Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Empleador</CardTitle>
              <CardDescription className="text-base">
                Accede a tu cuenta de empleador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Gestiona tus servicios contratados
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Califica trabajadores
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Historial de pagos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Configuración de perfil
                </li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/login/employer">
                  Iniciar Sesión como Empleador
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Trabajador Card */}
          <Card className="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">Trabajador</CardTitle>
              <CardDescription className="text-base">
                Accede a tu cuenta de trabajador
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Gestiona tus servicios ofrecidos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Actualiza tu perfil profesional
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Historial de trabajos
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Configuración de disponibilidad
                </li>
              </ul>
              <Button asChild className="w-full" size="lg">
                <Link to="/login/worker">
                  Iniciar Sesión como Trabajador
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer info */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginType;

